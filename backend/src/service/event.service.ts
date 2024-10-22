import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDTO } from 'src/dto/create.event.dto';
import { UpdateEventDTO } from 'src/dto/update.event.dto';
import { Event } from 'src/entity/Event';
import { User } from 'src/entity/User';
import { EventRepository } from 'src/repository/event.repository';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  public async createEvent(createEventDTO: CreateEventDTO): Promise<Event> {
    const user: User = new User(
      createEventDTO.firstName,
      createEventDTO.lastName,
      createEventDTO.email,
    );

    const event: Event = new Event(user, createEventDTO.eventDate);

    return await this.eventRepository.save(event);
  }

  public async getEvents(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  public async getEventById(eventId: string): Promise<Event> {
    const event: Event = await this.eventRepository.getOne(eventId);

    if (!event) {
      throw new NotFoundException(`Cannot find event with id = ${eventId}`);
    }

    return event;
  }

  public async updateEvent(
    eventId: string,
    updateEventDTO: UpdateEventDTO,
  ): Promise<Event> {
    const event: Event = await this.eventRepository.getOne(eventId);

    if (!event) {
      throw new NotFoundException(`Cannot find event with id = ${eventId}`);
    }

    event.setEventDate(updateEventDTO.eventDate);
    event.setUser(
      new User(
        updateEventDTO.firstName,
        updateEventDTO.lastName,
        updateEventDTO.email,
      ),
    );

    return await this.eventRepository.save(event);
  }

  public async deleteEventById(eventId: string): Promise<void> {
    const event: Event = await this.eventRepository.deleteById(eventId);

    if (!event) {
      throw new NotFoundException(`Cannot find event with id = ${eventId}`);
    }
  }
}
