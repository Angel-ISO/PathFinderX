export class UserDto {
  constructor({ firstName, lastName, username, email, password }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
