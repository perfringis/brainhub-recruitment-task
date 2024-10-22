import { Event } from 'src/entity/Event';
import { UserDTO } from './user.dto';

export class EventDTO {
  public user: UserDTO;
  public eventDate: Date;

  constructor(event: Event) {
    this.user = new UserDTO(event.getUser());
    this.eventDate = event.getEventDate();
  }
}
