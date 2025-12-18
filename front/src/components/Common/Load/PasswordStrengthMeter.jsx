import { Box, LinearProgress, Typography, Chip } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";

const PasswordStrengthMeter = ({ passwordStrength }) => {
  const { score, requirements } = passwordStrength;

  const getColor = () => {
    if (score >= 75) return 'success';
    if (score >= 50) return 'warning';
    if (score >= 25) return 'info';
    return 'error';
  };

  const getStrengthText = () => {
    if (score >= 75) return 'Fuerte';
    if (score >= 50) return 'Media';
    if (score >= 25) return 'Débil';
    return 'Muy débil';
  };

  const RequirementItem = ({ met, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
      {met ? (
        <CheckCircle sx={{ color: '#4ade80', fontSize: 16 }} />
      ) : (
        <Cancel sx={{ color: '#ef4444', fontSize: 16 }} />
      )}
      <Typography variant="body2" sx={{ color: met ? '#4ade80' : '#ef4444', fontSize: '0.8rem' }}>
        {text}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
          Fortaleza de la contraseña:
        </Typography>
        <Chip 
          label={getStrengthText()} 
          size="small" 
          color={getColor()}
          variant="outlined"
        />
      </Box>
      
      <LinearProgress
        variant="determinate"
        value={score}
        sx={{
          height: 6,
          borderRadius: 3,
          mb: 2,
          '& .MuiLinearProgress-bar': {
            backgroundColor: getColor() === 'success' ? '#4ade80' : 
                            getColor() === 'warning' ? '#f59e0b' : 
                            getColor() === 'info' ? '#3b82f6' : '#ef4444'
          }
        }}
      />

      <Box sx={{ mt: 2 }}>
        <RequirementItem
          met={requirements.hasUpperCase}
          text="Al menos 1 letra mayúscula"
        />
        <RequirementItem
          met={requirements.hasSpecialChar}
          text="Al menos 1 carácter especial"
        />
        <RequirementItem
          met={requirements.hasTwoNumbers}
          text="Al menos 2 números"
        />
        <RequirementItem
          met={requirements.hasMinLength}
          text="Mínimo 8 caracteres"
        />
      </Box>
    </Box>
  );
};

export default PasswordStrengthMeter;