import { Column } from 'typeorm';

export class User {
  @Column({ name: 'first_name', nullable: false, type: 'varchar' })
  private firstName: string;

  @Column({ name: 'last_name', nullable: false, type: 'varchar' })
  private lastName: string;

  @Column({ name: 'email', nullable: false, type: 'varchar' })
  private email: string;

  constructor(firstName: string, lastName: string, email: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getEmail(): string {
    return this.email;
  }
}
