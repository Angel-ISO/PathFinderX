import ApiResponse from '../../shared/errors/ApiResponse.js';

export class HaveConfirmedEmailException extends ApiResponse {
  constructor(message = 'The Email are not confirmed yet. check your email inbox.') {
    super(400, message);
    this.name = 'HaveConfirmedEmailException';
  }
}
