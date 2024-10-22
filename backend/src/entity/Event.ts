import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './User';

@Entity({ name: 'event' })
export class Event extends BaseEntity {
  @Column(() => User, {
    prefix: true,
  })
  private user: User;

  @Column({ name: 'event_date', nullable: false, type: 'date' })
  private eventDate: Date;

  constructor(user: User, eventDate: Date) {
    super();

    this.user = user;
    this.eventDate = eventDate;
  }
}
