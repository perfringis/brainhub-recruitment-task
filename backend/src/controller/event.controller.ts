import { Controller } from '@nestjs/common';
import { EventService } from 'src/service/event.service';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}
}
