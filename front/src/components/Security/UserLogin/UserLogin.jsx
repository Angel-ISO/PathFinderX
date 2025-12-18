import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  Divider,
  Fade,
  CircularProgress,
  alpha
} from "@mui/material"
import { Lock, AccountCircle, Login, ArrowForward } from "@mui/icons-material"
import { useLocation } from 'wouter'
import { useState } from "react"
import { UserLoginAct } from "../../../actions/AuthActions"
import { toast } from "react-hot-toast"
import { useStore } from "../../../context/Store";
import Header from "../../Common/Head/Header.jsx"

const UserLogin = () => {
  const [, navigate] = useLocation()
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  })
  const { dispatch } = useStore();


  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await UserLoginAct(userData)
      
      if (res.success && res.data?.jwt) {
        localStorage.setItem("token", res.data.jwt);
        dispatch({ type: "LOGIN", payload: res.data }); 
        toast.success(`Bienvenido de vuelta ${userData.username}`);
        navigate("/profile");
      } else {
        toast.error(res.message || "Credenciales incorrectas")
      }
    } catch (error) {
      console.error("Error en el login:", error)
      toast.error("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      bgcolor: 'background.default',
    }}>
      <Box sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        backgroundImage: `radial-gradient(circle 500px at 50% 300px, rgba(16,185,129,0.35), transparent)`,
      }} />

        <Header
        backButtonConfig={{
          onClick: () => navigate("/intro"), 
          text: "Regresar a Inicio",
          textColor: "#94a3b8"
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 10 }}>
        <Container maxWidth="sm" sx={{
          py: 8,
          pt: 12,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 128px)'
        }}>
          <Fade in timeout={800}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                background: alpha('#0f172a', 0.85),
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(74, 222, 128, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                },
              }}
            >
              <Box textAlign="center" mb={4}>
                <Login sx={{
                  fontSize: 56,
                  color: '#4ade80',
                  mb: 2,
                  p: 1,
                  bgcolor: alpha('#4ade80', 0.1),
                  borderRadius: '50%',
                  border: `1px solid ${alpha('#4ade80', 0.3)}`
                }} />
                <Typography variant="h4" component="h1" sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: 'linear-gradient(45deg, #4ade80, #22d3ee)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Iniciar Sesión
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  Ingresa tus credenciales para acceder a PathFinderX
                </Typography>
                <Divider sx={{
                  width: '80px',
                  height: '4px',
                  mx: 'auto',
                  mt: 2,
                  bgcolor: '#4ade80',
                  borderRadius: 2
                }} />
              </Box>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Nombre de usuario"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle sx={{ color: '#64748b' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: alpha('#1e293b', 0.5),
                      '& fieldset': {
                        borderColor: '#334155',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4ade80',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#94a3b8',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={userData.password}
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#64748b' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: alpha('#1e293b', 0.5),
                      '& fieldset': {
                        borderColor: '#334155',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4ade80',
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                  sx={{
                    mt: 4,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #4ade80 30%, #22d3ee 90%)',
                    boxShadow: '0 4px 20px rgba(74, 222, 128, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #16a34a 30%, #0d9488 90%)',
                      boxShadow: '0 6px 25px rgba(74, 222, 128, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: '#64748b',
                      color: '#e2e8f0'
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>

                <Box textAlign="center" mt={3}>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    ¿No tienes una cuenta?{' '}
                    <Typography
                      component="span"
                      variant="body2"
                      onClick={() => navigate("/register")}
                      sx={{
                        color: '#4ade80',
                        cursor: 'pointer',
                        fontWeight: 600,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Regístrate aquí
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </Box>
  )
}

export default UserLogin