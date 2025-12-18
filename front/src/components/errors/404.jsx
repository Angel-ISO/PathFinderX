import { Box, Typography, Button, Container, Fade } from '@mui/material'
import { Route, WarningAmber, ArrowBack } from '@mui/icons-material'
import { useLocation } from 'wouter'

const NotFoundPage = () => {
  const [, navigate] = useLocation()
  
  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Fade in={true} timeout={800}>
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Box
            sx={{
              position: 'relative',
              display: 'inline-block',
              mb: 4,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
                '100%': { transform: 'scale(1)' },
              },
            }}
          >
            <WarningAmber
              sx={{
                fontSize: 120,
                color: 'rgba(234, 179, 8, 0.8)',
                filter: 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.4))',
              }}
            />
            <Route
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 60,
                color: 'rgba(16, 185, 129, 0.9)',
              }}
            />
          </Box>

          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #ffffff, #a5b4fc)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Ruta no encontrada
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: '#94a3b8',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Parece que te has desviado del camino. La página que buscas no existe o ha sido movida.
          </Typography>

          <Box
            sx={{
              display: 'inline-flex',
              gap: 3,
              mb: 6,
              p: 3,
              borderRadius: 2,
              bgcolor: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(74, 222, 128, 0.1)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Código de error
              </Typography>
              <Typography variant="h6" sx={{ color: '#4ade80' }}>
                404
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Estado
              </Typography>
              <Typography variant="h6" sx={{ color: '#f59e0b' }}>
                Not Found
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/intro')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                borderColor: '#4ade80',
                color: '#4ade80',
                '&:hover': {
                  borderColor: '#22d3ee',
                  backgroundColor: 'rgba(74, 222, 128, 0.04)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Ir al inicio
            </Button>
          </Box>
        </Box>
      </Fade>
    </Container>
  )
}
export default NotFoundPage