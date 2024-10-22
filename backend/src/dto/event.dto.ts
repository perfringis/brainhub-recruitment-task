import { Event } from 'src/entity/Event';
import { UserDTO } from './user.dto';

export class EventDTO {
  public id: string;
  public user: UserDTO;
  public eventDate: Date;

  constructor(event: Event) {
    this.id = event.id;
    this.eventDate = event.getEventDate();
    this.user = new UserDTO(event.getUser());
  }
}
