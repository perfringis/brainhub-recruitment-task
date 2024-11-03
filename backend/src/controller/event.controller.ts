import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateOrUpdateEventDTO } from 'src/dto/create.or.update.event.dto';
import { EventDTO } from 'src/dto/event.dto';
import { Event } from 'src/entity/Event';
import { EventService } from 'src/service/event.service';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/events')
  public async getEvents(): Promise<EventDTO[]> {
    const events: Event[] = await this.eventService.getEvents();

    return this.toDtoList(events);
  }

  @Get('/event/:eventId')
  public async getEventById(
    @Param('eventId') eventId: string,
  ): Promise<EventDTO> {
    const event: Event = await this.eventService.getEventById(eventId);

    return this.toDto(event);
  }

  @Post('/event')
  @UsePipes(ValidationPipe)
  public async createEvent(
    @Body() createEventDTO: CreateOrUpdateEventDTO,
  ): Promise<EventDTO> {
    const event: Event = await this.eventService.createEvent(createEventDTO);

    return this.toDto(event);
  }

  @Put('/event')
  @UsePipes(ValidationPipe)
  public async updateEvent(
    @Param('eventId') eventId: string,
    @Body() updateEventDTO: CreateOrUpdateEventDTO,
  ): Promise<EventDTO> {
    const event: Event = await this.eventService.updateEvent(
      eventId,
      updateEventDTO,
    );

    return this.toDto(event);
  }

  @Delete('/event/:eventId')
  public async deleteEventById(
    @Param('eventId') eventId: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.eventService.deleteEventById(eventId);

    response.status(HttpStatus.NO_CONTENT).send();
  }

  private toDto(event: Event): EventDTO {
    return new EventDTO(event);
  }

  private toDtoList(events: Event[]): EventDTO[] {
    return events.map((event) => this.toDto(event));
  }
}
