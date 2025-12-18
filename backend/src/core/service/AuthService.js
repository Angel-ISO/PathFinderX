import UserService from './UserService.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../shared/utils/JwtUtils.js';
import AuthResponse from '../../api/dto/Auth/AuthResponse.js';
import AuthLoginRequest from '../../api/dto/Auth/AuthLoginRequest.js';
import { runInterceptors } from '../Interceptors/RunInterceptors.js';
import {validateConfirmedMail} from '../Interceptors/User/ConfirmedMailInterceptor.js';
import { sendVerificationEmail } from './EmailService.js';
import EmailVerificationToken from '../../Infrastructure/model/EmailVerificationTokenSchema.js';
import User from '../../Infrastructure/model/User.js';
import { Result } from '../../shared/errors/Result.js';
import { safeAsync } from '../../shared/errors/safeAsync.js';

export default class AuthService {
  constructor() {
    this.userService = new UserService();
  }

async login(requestBody) {
  const loginRequest = new AuthLoginRequest(requestBody);
  const { username, password } = loginRequest;

  const user = await this.userService.findByUsername(username);
  if (!user) {
    return Result.fail(
      new AuthResponse({
        username: null,
        message: 'User not found',
        jwt: null,
        status: false,
      })
    );
  }

  const interceptorResult = await safeAsync(() =>
    runInterceptors([() => validateConfirmedMail(user)])
  );

  if (interceptorResult.isFail()) {
    return Result.fail(
      new AuthResponse({
        username: null,
        message: interceptorResult.error.message,
        jwt: null,
        status: false,
      })
    );
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return Result.fail(
      new AuthResponse({
        username: null,
        message: 'Incorrect password',
        jwt: null,
        status: false,
      })
    );
  }

  const token = generateToken(user);

  return Result.ok(
    new AuthResponse({
      username: user.username,
      message: 'User logged in successfully',
      jwt: token,
      status: true,
    })
  );
}



async register(userData) {
  const createdUser = await this.userService.create(userData); 
  const token = generateToken(createdUser);

  await sendVerificationEmail(createdUser);

  return new AuthResponse({
    username: createdUser.username,
    message: 'Usuario registrado exitosamente',
    jwt: token,
    status: true,
  });
}


async verifyEmail(token) {
    const record = await EmailVerificationToken.findOne({ token });
    
    if (!record) {
      throw new Error('invalid token or already used');
    }

    if (record.expiresAt < new Date()) {
      throw new Error('token expired');
    }

    await User.findByIdAndUpdate(record.userId, { isVerified: true });
    await EmailVerificationToken.deleteOne({ _id: record._id });

    return { message: 'email verified correctly. You can now login.' };
  }

}