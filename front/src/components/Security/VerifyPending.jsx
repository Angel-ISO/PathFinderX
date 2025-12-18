import { Box, Typography, Button, Container, Paper, Fade, Zoom, keyframes, alpha } from "@mui/material";
import { useLocation } from 'wouter';
import { MarkEmailRead, ArrowForward } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { GetCurrentUserEmailAct } from "../../actions/UserActions.js";


const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const VerifyPending = () => {
  const [, navigate] = useLocation();
  const [showContent, setShowContent] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setShowContent(true);
    const email = GetCurrentUserEmailAct();
    setEmail(email);
  }, []);

  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage: `radial-gradient(circle 500px at 50% 300px, rgba(16,185,129,0.35), transparent)`,
        }}
      />

      <Container 
        maxWidth="sm" 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center',
          position: 'relative',
          zIndex: 10
        }}
      >
        <Fade in={showContent} timeout={800}>
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Zoom in={showContent} style={{ transitionDelay: showContent ? '300ms' : '0ms' }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  borderRadius: 4,
                  background: alpha('#0f172a', 0.85),
                  backdropFilter: 'blur(20px)',
                  border: '1px solid',
                  borderColor: alpha('#10b981', 0.3),
                  boxShadow: `
                    0 8px 32px ${alpha('#000', 0.4)},
                    0 0 0 1px ${alpha('#10b981', 0.1)} inset
                  `,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #10b981, #3b82f6)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    mb: 3,
                    borderRadius: '50%',
                    bgcolor: alpha('#10b981', 0.1),
                    border: `2px solid ${alpha('#10b981', 0.3)}`,
                    animation: `${pulseAnimation} 3s infinite ease-in-out`,
                  }}
                >
                  <MarkEmailRead
                    sx={{
                      fontSize: 64,
                      color: '#10b981',
                    }}
                  />
                </Box>

                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    background: 'linear-gradient(45deg, #10b981, #3b82f6)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '2rem', sm: '2.5rem' },
                  }}
                >
                  Verificación Obligatoria Requerida
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: '#94a3b8',
                    mb: 3,
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    lineHeight: 1.6,
                  }}
                >
                  Hemos enviado un enlace de verificación a{' '}
                  <Box component="span" sx={{ color: '#e2e8f0', fontWeight: 500 }}>
                    {email}
                  </Box>
                  . Por favor revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta. Hazlo lo mas pronto posible ya que si no lo haces en 30 minutos no podras acceder a tu cuenta. Nunca...
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() =>{
                    localStorage.removeItem("token")
                    navigate('/login')
                  } }
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #10b981 30%, #3b82f6 90%)',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #059669 30%, #2563eb 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 25px rgba(16, 185, 129, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Ya verifiqué mi email
                </Button>
              </Paper>
            </Zoom>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default VerifyPending;