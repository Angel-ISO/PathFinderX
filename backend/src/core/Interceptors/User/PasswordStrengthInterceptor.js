import { InvalidPasswordException } from '../../Exceptions/InvalidPasswordException.js';

export function validatePasswordStrength(password) {
  const regex = /^(?=.*[A-Z])(?=(?:.*\d){2,})(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  if (!password || !regex.test(password)) {
    throw new InvalidPasswordException();
  }
}
