import { Injectable } from '@nestjs/common';
import { Event } from 'src/entity/Event';
import { DataSource, DeleteResult, Repository } from 'typeorm';

@Injectable()
export class EventRepository extends Repository<Event> {
  constructor(private dataSource: DataSource) {
    super(Event, dataSource.createEntityManager());
  }

  public async getOne(eventId: string): Promise<Event> {
    return this.findOne({
      where: {
        id: eventId,
      },
    });
  }

  public async deleteById(eventId: string): Promise<Event> {
    const event: Event = await this.getOne(eventId);

    if (!event) {
      return null;
    }

    return await this.remove(event);
  }
}
