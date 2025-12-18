import ApiResponse  from '../../shared/errors/ApiResponse.js';

export class UsernameAlreadyExistsException extends ApiResponse {
  constructor(message = 'Username already exists.') {
    super(400, message);
    this.name = 'UsernameAlreadyExistsException';
  }
}

