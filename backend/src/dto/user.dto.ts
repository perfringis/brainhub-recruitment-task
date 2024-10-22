import { User } from 'src/entity/User';

export class UserDTO {
  public firstName: string;
  public lastName: string;
  public email: string;

  constructor(user: User) {
    this.firstName = user.getFirstName();
    this.lastName = user.getLastName();
    this.email = user.getEmail();
  }
}
