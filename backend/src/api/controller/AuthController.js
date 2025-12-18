import AuthService from '../../core/service/AuthService.js';

// DIP
// Este módulo depende de la abstracción AuthService, no de su implementación concreta.
// Esto me permite cambiar la implementación de AuthService sin afectar a este módulo.

const authService = new AuthService();

export const register = async (req, res, next) => {
  try {
    const response = await authService.register(req.body);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    if (result.isFail()) {
      return res.status(401).json(result.error); 
    }
    return res.status(200).json(result.value);
  } catch (error) {
    next(error); 
  }
};


export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const response = await authService.verifyEmail(token);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};