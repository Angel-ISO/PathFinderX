import bcrypt from 'bcryptjs';

export async function toUserUpdateEntity(updateUserDto) {
  const updates = {};

  if (updateUserDto.firstName !== undefined) updates.firstName = updateUserDto.firstName;
  if (updateUserDto.lastName !== undefined) updates.lastName = updateUserDto.lastName;
  if (updateUserDto.username !== undefined) updates.username = updateUserDto.username;
  if (updateUserDto.email !== undefined) updates.email = updateUserDto.email;

  if (updateUserDto.password !== undefined) {
    const salt = await bcrypt.genSalt(10);
    updates.password = await bcrypt.hash(updateUserDto.password, salt);
  }

  return updates;
}