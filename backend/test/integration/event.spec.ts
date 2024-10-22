import { AppModule } from 'src/app.module';
import { EventService } from 'src/service/event.service';
import { Test } from '@nestjs/testing';
import { CreateEventDTO } from 'src/dto/create.event.dto';
import { Event } from 'src/entity/Event';
import { QueryFailedError } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateEventDTO } from 'src/dto/update.event.dto';

describe('Event integration test', () => {
  let eventService: EventService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = await module.createNestApplication().init();

    eventService = app.get<EventService>(EventService);
  });

  test('should create event with valid data', async () => {
    // given
    const dto: CreateEventDTO = new CreateEventDTO(
      'John',
      'Doe',
      'test@test.com',
      new Date(),
    );

    // when
    const event: Event = await eventService.createEvent(dto);

    // then
    expect(dto.firstName).toEqual(event.getUser().getFirstName());
    expect(dto.lastName).toEqual(event.getUser().getLastName());
    expect(dto.email).toEqual(event.getUser().getEmail());
    expect(dto.eventDate).toEqual(event.getEventDate());
    expect(event.getId()).not.toBeNull();

    // after
    await eventService.deleteEventById(event.getId());
  });

  test('should not create event with invalid data', async () => {
    // when
    const dto: CreateEventDTO = new CreateEventDTO(
      null,
      'Doe',
      'test@test.com',
      new Date(),
    );

    // then
    await expect(() => eventService.createEvent(dto)).rejects.toThrow(
      QueryFailedError,
    );
  });

  test('should get all events', async () => {
    // given
    const firstEvent: Event = await createEvent();
    const secondEvent: Event = await createEvent();

    // when
    const events: Event[] = await eventService.getEvents();

    // then
    expect(events.length).toEqual(2);

    // after
    await eventService.deleteEventById(firstEvent.getId());
    await eventService.deleteEventById(secondEvent.getId());
  });

  test('should get event by event id', async () => {
    // given
    const createdEvent: Event = await createEvent();

    // when
    const foundEvent: Event = await eventService.getEventById(
      createdEvent.getId(),
    );

    // then
    expect(foundEvent.getId()).toEqual(createdEvent.getId());
    expect(foundEvent.getUser().getFirstName()).toEqual(
      createdEvent.getUser().getFirstName(),
    );
    expect(foundEvent.getUser().getLastName()).toEqual(
      createdEvent.getUser().getLastName(),
    );
    expect(foundEvent.getUser().getEmail()).toEqual(
      createdEvent.getUser().getEmail(),
    );

    // after
    await eventService.deleteEventById(createdEvent.getId());
  });

  test('should not get event by event id if event is not present in database', async () => {
    // expect
    await expect(() =>
      eventService.getEventById('d7b8d8e3-3ab5-4080-ac66-02693c7a5ae2'),
    ).rejects.toThrow(NotFoundException);
  });

  test('should delete event by event id', async () => {
    // given
    const createdEvent: Event = await createEvent();

    // then
    await eventService.deleteEventById(createdEvent.getId());

    await expect(() =>
      eventService.getEventById(createdEvent.getId()),
    ).rejects.toThrow(NotFoundException);
  });

  test('should not delete event by event id if event is not present in database', async () => {
    // expect
    await expect(() =>
      eventService.deleteEventById('d7b8d8e3-3ab5-4080-ac66-02693c7a5ae2'),
    ).rejects.toThrow(NotFoundException);
  });

  test('should update existing event', async () => {
    // given
    const createdEvent: Event = await createEvent();

    // when
    const now = new Date();

    const updatedEvent: Event = await eventService.updateEvent(
      createdEvent.getId(),
      new UpdateEventDTO('Johnny', 'Don', 'test@gmail.com', now),
    );

    // then
    expect(updatedEvent.getId()).toEqual(createdEvent.getId());
    expect(updatedEvent.getEventDate()).toEqual(now);
    expect(updatedEvent.getUser().getFirstName()).toEqual('Johnny');
    expect(updatedEvent.getUser().getLastName()).toEqual('Don');
    expect(updatedEvent.getUser().getEmail()).toEqual('test@gmail.com');

    // after
    await eventService.deleteEventById(createdEvent.getId());
  });

  test('should not update event when invalid data', async () => {
    // when
    const createdEvent: Event = await createEvent();

    // then
    const now = new Date();

    await expect(
      eventService.updateEvent(
        createdEvent.getId(),
        new UpdateEventDTO(null, 'Don', 'test@gmail.com', now),
      ),
    ).rejects.toThrow(QueryFailedError);

    // after
    await eventService.deleteEventById(createdEvent.getId());
  });

  test('should not update event when event is not present in database', async () => {
    await expect(
      eventService.updateEvent(
        'd7b8d8e3-3ab5-4080-ac66-02693c7a5ae2',
        new UpdateEventDTO(null, 'Don', 'test@gmail.com', new Date()),
      ),
    ).rejects.toThrow(NotFoundException);
  });

  const createEvent = async (): Promise<Event> => {
    const dto: CreateEventDTO = new CreateEventDTO(
      'John',
      'Doe',
      'test@test.com',
      new Date(),
    );

    return await eventService.createEvent(dto);
  };
});
