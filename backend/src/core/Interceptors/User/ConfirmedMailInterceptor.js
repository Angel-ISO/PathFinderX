import { HaveConfirmedEmailException } from '../../Exceptions/HaveConfirmedEmailException.js';

export  function validateConfirmedMail(user) {
    if (!user.isVerified) {
      throw new HaveConfirmedEmailException();
    }
}