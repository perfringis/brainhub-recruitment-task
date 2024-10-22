import { Injectable } from '@nestjs/common';
import { EventRepository } from 'src/repository/event.repository';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}
}
