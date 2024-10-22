import { IsDateString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateEventDTO {
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
}
