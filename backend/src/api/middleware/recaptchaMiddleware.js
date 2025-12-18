import axios from 'axios';
import ApiResponse from '../../shared/errors/ApiResponse.js';

export const verifyRecaptchaToken = async (req, res, next) => {
  const token = req.body.recaptchaToken;

  if (!token) {
    return res.status(400).json(new ApiResponse(400, 'reCAPTCHA token requerido'));
  }

  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY;

    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret,
        response: token,
      },
    });

    const { success, score } = response.data;

    if (!success || (score !== undefined && score < 0.5)) {
      return res.status(403).json(new ApiResponse(403, 'Falló la verificación reCAPTCHA'));
    }

    next();
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, 'Error verificando CAPTCHA', error));
  }
};

