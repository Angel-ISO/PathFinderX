import { useState, useMemo } from 'react';

export const usePasswordStrength = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, requirements: {} };

    let score = 0;
    const requirements = {
      hasUpperCase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasTwoNumbers: (password.match(/\d/g) || []).length >= 2,
      hasMinLength: password.length >= 8
    };

    if (requirements.hasUpperCase) score += 25;
    if (requirements.hasSpecialChar) score += 25;
    if (requirements.hasTwoNumbers) score += 25;
    if (requirements.hasMinLength) score += 25;

    return {
      score,
      requirements,
      isValid: requirements.hasUpperCase && 
               requirements.hasSpecialChar && 
               requirements.hasTwoNumbers && 
               requirements.hasMinLength
    };
  }, [password]);

  return {
    password,
    setPassword,
    showPassword,
    setShowPassword,
    passwordStrength
  };
};