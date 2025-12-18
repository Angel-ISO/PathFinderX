import ApiResponse from '../../shared/errors/ApiResponse.js';

export class InvalidPasswordException extends ApiResponse {
  constructor(message = 'Password must contain at least one uppercase letter, two digits, and one special character.') {
    super(400, message);
    this.name = 'InvalidPasswordException';
    
  }
}
