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

  public getUser(): User {
    return this.user;
  }

  public setUser(user: User): void {
    this.user = user;
  }

  public getEventDate(): Date {
    return this.eventDate;
  }

  public setEventDate(eventDate: Date): void {
    this.eventDate = eventDate;
  }
}
