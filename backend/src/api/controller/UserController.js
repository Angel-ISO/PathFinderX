import UserService from '../../core/service/UserService.js';
import { toUserResponse } from '../../api/dto/User/toUserResponse.js';
import { UpdateUserDto } from '../dto/User/UpdateUserDto.js';

const userService = new UserService(); 

export const getAll = async (req, res, next) => {
  try {
    const { page = 1, size = 10, search = '' } = req.query;
    
    const pager = await userService.findAll({ 
      pageIndex: parseInt(page), 
      pageSize: parseInt(size), 
      search 
    });
    
    const response = pager.mapRegisters(toUserResponse);
    
    res.status(200).json({
      data: response.registers,
      pagination: response.getPaginationInfo()
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(toUserResponse(user));
  } catch (error) {
    next(error);
  }
};

export const patch = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dto = UpdateUserDto.fromRequest(req.body);

    const updatedUser = await userService.update(id, dto);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(toUserResponse(updatedUser));
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};