import User from '../../../Infrastructure/model/User.js';
import { EmailAlreadyExistsException } from '../../Exceptions/EmailAlreadyExist.js';

export async function validateUniqueEmail(email) {
  const exists = await User.exists({ email });
  if (exists) {
    throw new EmailAlreadyExistsException();
  }
}
