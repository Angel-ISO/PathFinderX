import ApiResponse from '../../shared/errors/ApiResponse.js';

export class EmailAlreadyExistsException extends ApiResponse {
  constructor(message = 'The email address already exists.') {
    super(400, message);
    this.name = 'EmailAlreadyExistsException';
  }
}
