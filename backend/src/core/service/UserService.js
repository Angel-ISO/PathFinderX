import UserRepository from '../../Infrastructure/repository/UserRepository.js';
import { runInterceptors } from '../Interceptors/RunInterceptors.js';
import { validateUniqueUsername } from '../Interceptors/User/UniqueUsernameInterceptor.js';
import { validateUniqueEmail } from '../Interceptors/User/UniqueEmailInterceptor.js';
import { validatePasswordStrength } from '../Interceptors/User/PasswordStrengthInterceptor.js';
import { createPager } from '../helpers/Pager.js';
import { createParams } from '../helpers/Params.js';
import bcrypt from 'bcryptjs';
import { toUserUpdateEntity } from '../../api/dto/User/toUserUpdateEntity.js';

// ISP
// Los métodos de este servicio están organizados en funciones específicas (crear, leer, actualizar, eliminar),
// evitando interfaces grandes y genéricas, y facilitando la implementación de solo lo necesario en cada caso.

export default class UserService {
  constructor({ userRepository = new UserRepository(), runInterceptorsFn = runInterceptors } = {}) {
    this.userRepository = userRepository;
    this.runInterceptors = runInterceptorsFn;
  }

  async findByEmail(email) {
    return this.userRepository.findByEmail(email);
  }

  async findByUsername(username) {
    return this.userRepository.findByUsername(username);
  }

  async findById(id) {
    return this.userRepository.findById(id);
  }

  async create(userData) {
    await this.runInterceptors([
      ({ username }) => validateUniqueUsername(username),
      ({ email }) => validateUniqueEmail(email),
      ({ password }) => validatePasswordStrength(password),
    ], userData);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    return this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
  }

  async update(id, updateUserDto) {
  const interceptors = [];

  if (updateUserDto.username !== undefined) {
    interceptors.push(({ username }) => validateUniqueUsername(username));
  }

  if (updateUserDto.email !== undefined) {
    interceptors.push(({ email }) => validateUniqueEmail(email));
  }

  if (updateUserDto.password !== undefined) {
    interceptors.push(({ password }) => validatePasswordStrength(password));
  }

  await this.runInterceptors(interceptors, updateUserDto);

  const updates = await toUserUpdateEntity(updateUserDto);

  return this.userRepository.update(id, updates);
}


  async delete(id) {
    return this.userRepository.delete(id);
  }

  async findAll({ pageIndex = 1, pageSize = 10, search = '' } = {}) {
    const params = createParams({ pageIndex, pageSize, search });

    const query = !params.search
      ? {}
      : {
          $or: [
            { username: { $regex: params.search, $options: 'i' } },
            { firstName: { $regex: params.search, $options: 'i' } },
            { lastName: { $regex: params.search, $options: 'i' } }
          ]
        };

    const [total, users] = await Promise.all([
      this.userRepository.countDocuments(query),
      this.userRepository.findAll({
        query,
        skip: (params.pageIndex - 1) * params.pageSize,
        limit: params.pageSize
      })
    ]);

    return createPager({
      registers: users,
      total,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
      search: params.search
    });
  }
}