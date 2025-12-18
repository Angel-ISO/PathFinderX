// src/core/dto/UpdateUserDto.js

export class UpdateUserDto {
  constructor({ firstName, lastName, username, email, password }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static fromRequest(body) {
    return new UpdateUserDto({
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      email: body.email,
      password: body.password,
    });
  }
}