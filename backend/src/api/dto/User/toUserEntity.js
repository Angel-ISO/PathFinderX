import RoleEnum from '../../../Infrastructure/model/Enum/RoleEnum.js';

export function toUserEntity(userDto) {
  return {
    ...userDto,
    role: RoleEnum.USER,
    isEnabled: true,
    isVerified: false,
  };
}
