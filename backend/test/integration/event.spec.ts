import { AppModule } from 'src/app.module';
import { EventService } from 'src/service/event.service';
import { Test } from '@nestjs/testing';
import { Event } from 'src/entity/Event';
import { QueryFailedError } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateOrUpdateEventDTO } from 'src/dto/create.or.update.event.dto';

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
    const createEventDTO: CreateOrUpdateEventDTO = new CreateOrUpdateEventDTO(
      'John',
      'Doe',
      'test@test.com',
      new Date(),
    );

    // when
    const event: Event = await eventService.createEvent(createEventDTO);

    // then
    expect(createEventDTO.firstName).toEqual(event.getUser().getFirstName());
    expect(createEventDTO.lastName).toEqual(event.getUser().getLastName());
    expect(createEventDTO.email).toEqual(event.getUser().getEmail());
    expect(createEventDTO.eventDate).toEqual(event.getEventDate());
    expect(event.getId()).not.toBeNull();

    // after
    await eventService.deleteEventById(event.getId());
  });

  test('should not create event with invalid data', async () => {
    // when
    const createEventDTO: CreateOrUpdateEventDTO = new CreateOrUpdateEventDTO(
      null,
      'Doe',
      'test@test.com',
      new Date(),
    );

    // then
    await expect(() =>
      eventService.createEvent(createEventDTO),
    ).rejects.toThrow(QueryFailedError);
  });

  test('should get all events', async () => {
    // given
    const firstEvent: Event = await createEvent();
    // and
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

    // when
    await eventService.deleteEventById(createdEvent.getId());

    // then
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

    // and
    const updateEventDTO: CreateOrUpdateEventDTO = new CreateOrUpdateEventDTO(
      'Johnny',
      'Don',
      'test@gmail.com',
      now,
    );

    // and
    const updatedEvent: Event = await eventService.updateEvent(
      createdEvent.getId(),
      updateEventDTO,
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

    // and
    const updateEventDTO: CreateOrUpdateEventDTO = new CreateOrUpdateEventDTO(
      null,
      'Don',
      'test@gmail.com',
      now,
    );

    await expect(
      eventService.updateEvent(createdEvent.getId(), updateEventDTO),
    ).rejects.toThrow(QueryFailedError);

    // after
    await eventService.deleteEventById(createdEvent.getId());
  });

  test('should not update event when event is not present in database', async () => {
    // when
    const now: Date = new Date();

    // and
    const updateEventDTO: CreateOrUpdateEventDTO = new CreateOrUpdateEventDTO(
      null,
      'Don',
      'test@gmail.com',
      now,
    );

    // then
    await expect(
      eventService.updateEvent(
        'd7b8d8e3-3ab5-4080-ac66-02693c7a5ae2',
        updateEventDTO,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  const createEvent = async (): Promise<Event> => {
    const now: Date = new Date();

    const eventDTO: CreateOrUpdateEventDTO = new CreateOrUpdateEventDTO(
      'John',
      'Doe',
      'test@test.com',
      now,
    );

    return await eventService.createEvent(eventDTO);
  };
});
