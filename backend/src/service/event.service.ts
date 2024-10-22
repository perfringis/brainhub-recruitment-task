import { Injectable } from '@nestjs/common';
import { Event } from 'src/entity/Event';
import { EventRepository } from 'src/repository/event.repository';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  public async getEvents(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  public async getEventById(eventId: string): Promise<Event> {
    return await this.eventRepository.getOne(eventId);
  }

  public async deleteEventById(eventId: string): Promise<void> {
    return await this.eventRepository.deleteById(eventId);
  }
}
