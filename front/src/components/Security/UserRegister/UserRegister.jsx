import {
  Container, Paper, TextField, Button, Typography, Box, InputAdornment, Divider, Fade, IconButton
} from "@mui/material"
import { Person, Email, Lock, AccountCircle, ArrowForward, Visibility, VisibilityOff } from "@mui/icons-material"
import { useLocation } from 'wouter'
import { useState, useEffect } from "react"
import { registerUserAct } from "../../../actions/AuthActions.js"
import { toast } from "react-hot-toast"
import Header from "../../Common/Head/Header.jsx"
import PasswordStrengthMeter from "../../Common/Load/PasswordStrengthMeter.jsx";
import { usePasswordStrength } from "../../../hooks/usePasswordStrength.js";

const UserRegister = () => {
  const [, navigate] = useLocation()
  const [loading, setLoading] = useState(false)
  const [showContent, setShowContent] = useState(false)
  // Hook para el validador de contraseña
  const {
    password,
    setPassword,
    showPassword,
    setShowPassword,
    passwordStrength
  } = usePasswordStrength()

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    password: false
  })

  useEffect(() => {
    setShowContent(true)
  }, [])

  const handleUserDataChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }))
    }
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    setUserData(prev => ({ ...prev, password: value }))
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: false }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      firstName: !userData.firstName,
      lastName: !userData.lastName,
      username: !userData.username,
      email: !userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email),
      password: !passwordStrength.isValid
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await registerUserAct(userData);
      toast.success(`Registro exitoso! Bienvenido ${userData.username}`);
      window.localStorage.setItem("token", response.data.jwt);
      navigate("/verify-pending");
    } catch (error) {
      toast.error(error?.response?.data?.Message || "Hubo un error al registrarse");
    } finally {
      setLoading(false);
    }
  };

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
          <Fade in={showContent} timeout={800}>
            <Paper elevation={3} sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(74, 222, 128, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
              },
            }}>
              <Box textAlign="center" mb={4}>
                <AccountCircle sx={{
                  fontSize: 56,
                  color: '#4ade80',
                  mb: 2,
                  p: 1,
                  bgcolor: 'rgba(74, 222, 128, 0.1)',
                  borderRadius: '50%',
                  border: '1px solid rgba(74, 222, 128, 0.3)'
                }} />
                <Typography variant="h4" component="h1" sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: 'linear-gradient(45deg, #4ade80, #22d3ee)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Crear Cuenta
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  Únete a PathFinderX y descubre el poder de los algoritmos de ruta
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
                  label="Nombre"
                  name="firstName"
                  variant="outlined"
                  margin="normal"
                  value={userData.firstName}
                  onChange={handleUserDataChange}
                  error={errors.firstName}
                  helperText={errors.firstName && "Este campo es requerido"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: errors.firstName ? '#ef4444' : '#64748b' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(30, 41, 59, 0.5)',
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
                  label="Apellido"
                  name="lastName"
                  variant="outlined"
                  margin="normal"
                  value={userData.lastName}
                  onChange={handleUserDataChange}
                  error={errors.lastName}
                  helperText={errors.lastName && "Este campo es requerido"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: errors.lastName ? '#ef4444' : '#64748b' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(30, 41, 59, 0.5)',
                      '& fieldset': {
                        borderColor: '#334155',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4ade80',
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Nombre de usuario"
                  name="username"
                  variant="outlined"
                  margin="normal"
                  value={userData.username}
                  onChange={handleUserDataChange}
                  error={errors.username}
                  helperText={errors.username && "Este campo es requerido"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle sx={{ color: errors.username ? '#ef4444' : '#64748b' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(30, 41, 59, 0.5)',
                      '& fieldset': {
                        borderColor: '#334155',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4ade80',
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  value={userData.email}
                  onChange={handleUserDataChange}
                  error={errors.email}
                  helperText={errors.email && (userData.email ? "Email inválido" : "Este campo es requerido")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: errors.email ? '#ef4444' : '#64748b' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(30, 41, 59, 0.5)',
                      '& fieldset': {
                        borderColor: '#334155',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4ade80',
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  margin="normal"
                  value={password}
                  onChange={handlePasswordChange}
                  error={errors.password}
                  helperText={errors.password && "La contraseña no cumple con los requisitos de seguridad"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: errors.password ? '#ef4444' : '#64748b' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#64748b' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(30, 41, 59, 0.5)',
                      '& fieldset': {
                        borderColor: '#334155',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4ade80',
                      },
                    },
                  }}
                />

                {/* Password Strength Meter - Solo se muestra si hay texto en la contraseña */}
                {password && (
                  <PasswordStrengthMeter passwordStrength={passwordStrength} />
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={<ArrowForward />}
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
                  {loading ? 'Registrando...' : 'Crear Cuenta'}
                </Button>

                <Box textAlign="center" mt={3}>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    ¿Ya tienes una cuenta?{' '}
                    <Typography
                      component="span"
                      variant="body2"
                      onClick={() => navigate("/login")}
                      sx={{
                        color: '#4ade80',
                        cursor: 'pointer',
                        fontWeight: 600,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Inicia sesión aquí
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

export default UserRegister