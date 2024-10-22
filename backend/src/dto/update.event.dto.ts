import { IsDateString, IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateEventDTO {
  @IsNotEmpty()
  public firstName: string;

  @IsNotEmpty()
  public lastName: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsDateString()
  public eventDate: Date;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    eventDate: Date,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.eventDate = eventDate;
  }
}
