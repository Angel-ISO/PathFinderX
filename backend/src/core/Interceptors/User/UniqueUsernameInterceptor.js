import User from '../../../Infrastructure/model/User.js';
import { UsernameAlreadyExistsException } from '../../Exceptions/UsernameAlreadyExistsException.js';

export async function validateUniqueUsername(username) {
  const exists = await User.exists({ username });
  if (exists) {
    throw new UsernameAlreadyExistsException();
  }
}
