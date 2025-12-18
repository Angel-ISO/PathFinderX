import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  Divider,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Chip,
  Fade
} from "@mui/material";
import { 
  Person, 
  Email, 
  Lock, 
  AccountCircle, 
  Edit, 
  Save, 
  Cancel, 
  Delete, 
  Visibility, 
  VisibilityOff,
  VerifiedUser,
  Security
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import Header from "../../Common/Head/Header.jsx";
import { useStore } from "../../../context/Store.jsx";
import { GetCurrentUserAct ,UpdateCurrentUserAct, DeleteCurrentUserAct } from "../../../actions/UserActions.js";
import toast from "react-hot-toast";
import { showInputAlert } from "../../../utils/Alerts.js";
import { useLocation } from 'wouter';
import LoaderWrapper from "../../Common/Load/LoaderWrapper.jsx";

const UserProfile = () => {
  const { state, dispatch } = useStore();
  const { userSession } = state;
  const [, navigate] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  const [editData, setEditData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (userSession.authenticated && (!userSession.email || !userSession.firstName)) {
          const res = await GetCurrentUserAct();
          if (res.success) {
            dispatch({
              type: 'UPDATE_PROFILE',
              payload: {
                ...userSession,
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                email: res.data.email,
                username: res.data.username,
                role: res.data.role
              }
            });
            setEditData({
              username: res.data.username,
              firstName: res.data.firstName,
              lastName: res.data.lastName,
              email: res.data.email,
              password: ""
            });
          }
        } else if (userSession.authenticated) {
          setEditData({
            username: userSession.username,
            firstName: userSession.firstName,
            lastName: userSession.lastName,
            email: userSession.email,
            password: ""
          });
        }
      } catch (error) {
        toast.error("Error al cargar datos del usuario");
      } finally {
        setLocalLoading(false);
      }
    };

    loadUserData();
  }, [userSession.authenticated, dispatch, userSession]);

  const handleEdit = () => setIsEditing(true);
  
  const handleSave = async () => {
    try {
      setActionLoading(true);
      const payload = {
        ...(editData.firstName !== userSession.firstName && { firstName: editData.firstName }),
        ...(editData.lastName !== userSession.lastName && { lastName: editData.lastName }),
        ...(editData.username !== userSession.username && { username: editData.username }),
        ...(editData.email !== userSession.email && { email: editData.email }),
        ...(editData.password && { password: editData.password })
      };

      const res = await UpdateCurrentUserAct(payload);
      if (res.success) {
        dispatch({
          type: 'UPDATE_PROFILE',
          payload: {
            ...userSession,
            ...payload
          }
        });
        toast.success("Perfil actualizado correctamente");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Error al guardar cambios");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const { inputValue, isConfirmed } = await showInputAlert({
      title: '¿Estás seguro de eliminar tu cuenta?',
      inputLabel: `Escribe "${userSession.username}" para confirmar:`,
      inputPlaceholder: userSession.username
    });

    if (!isConfirmed || inputValue !== userSession.username) {
      toast.error("No se pudo confirmar la eliminación");
      return;
    }

    try {
      setActionLoading(true);
      const res = await DeleteCurrentUserAct();
      if (res.success) {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem("token");
        navigate("/");
        toast.success("Cuenta eliminada correctamente");
      }
    } catch (error) {
      toast.error("Error al eliminar la cuenta", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      username: userSession.username,
      firstName: userSession.firstName,
      lastName: userSession.lastName,
      email: userSession.email,
      password: ""
    });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const isLoading = !userSession.authenticated || localLoading;
  const isPerformingAction = actionLoading;

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundImage: `radial-gradient(circle 500px at 50% 300px, rgba(16,185,129,0.35), transparent)`,
      pt: 8,
      pb: 4
    }}>
      <Header
        backButtonConfig={{
          onClick: () => navigate("/home"), 
          text: "Regresar a la pagina principal",
          textColor: "#94a3b8"
        }}
      />
      
      <LoaderWrapper 
        loading={isLoading} 
        text={isPerformingAction ? "Guardando cambios..." : "Cargando perfil..."}
      >
        <Fade in={!isLoading} timeout={500}>
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{
              p: 4,
              borderRadius: 4,
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              {/* Header del perfil */}
              <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between" mb={4}>
                <Box display="flex" alignItems="center" gap={3} mb={{ xs: 3, md: 0 }}>
                  <Avatar sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    border: '2px solid #4ade80'
                  }}>
                    {userSession?.firstName?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="h1" fontWeight={600} sx={{
                      background: 'linear-gradient(45deg, #4ade80, #22d3ee)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {`${userSession?.firstName || ''} ${userSession?.lastName || ''}`}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      mt: 1
                    }}>
                      @{userSession?.username}
                    </Typography>
                    <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                      <Chip 
                        icon={<VerifiedUser fontSize="small" />}
                        label={userSession?.role || "user"}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>

                <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                  {!isEditing ? (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                        sx={{
                          borderColor: '#4ade80',
                          color: '#4ade80',
                          '&:hover': {
                            bgcolor: 'rgba(74, 222, 128, 0.1)'
                          }
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleDeleteAccount}
                        disabled={isPerformingAction}
                        sx={{
                          borderColor: '#ef4444',
                          color: '#ef4444',
                          '&:hover': {
                            bgcolor: 'rgba(239, 68, 68, 0.1)'
                          }
                        }}
                      >
                        Eliminar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                        disabled={isPerformingAction}
                        sx={{
                          borderColor: '#94a3b8',
                          color: '#94a3b8',
                          '&:hover': {
                            bgcolor: 'rgba(148, 163, 184, 0.1)'
                          }
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                        disabled={isPerformingAction}
                        sx={{
                          background: 'linear-gradient(45deg, #4ade80 0%, #22d3ee 100%)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #16a34a 0%, #0d9488 100%)'
                          }
                        }}
                      >
                        Guardar
                      </Button>
                    </>
                  )}
                </Box>
              </Box>

              <Divider sx={{ borderColor: 'rgba(74, 222, 128, 0.2)', mb: 4 }} />

              {/* Información del usuario */}
              <Box component="form" sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  mb: 3,
                  color: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Security fontSize="small" /> Información Personal
                </Typography>

                {/* Campos del formulario */}
                {[
                  { field: 'firstName', label: 'Nombre', icon: <Person /> },
                  { field: 'lastName', label: 'Apellido', icon: <Person /> },
                  { field: 'username', label: 'Nombre de usuario', icon: <AccountCircle /> },
                  { field: 'email', label: 'Correo electrónico', icon: <Email /> },
                  { field: 'password', label: 'Contraseña', icon: <Lock />, isPassword: true }
                ].map(({ field, label, icon, isPassword }) => (
                  <Card key={field} sx={{ 
                    mb: 2, 
                    bgcolor: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid rgba(74, 222, 128, 0.1)'
                  }}>
                    <CardContent sx={{ py: 2 }}>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          label={label}
                          type={isPassword ? (showPassword ? "text" : "password") : "text"}
                          value={editData[field] || ''}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          variant="outlined"
                          size="small"
                          placeholder={isPassword ? "Dejar vacío para mantener la actual" : ""}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ color: '#64748b' }}>
                                {icon}
                              </InputAdornment>
                            ),
                            ...(isPassword && {
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
                              )
                            }),
                            sx: {
                              color: '#e2e8f0',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(74, 222, 128, 0.3)'
                              }
                            }
                          }}
                          InputLabelProps={{
                            sx: { color: '#94a3b8' }
                          }}
                        />
                      ) : (
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box sx={{ color: '#64748b' }}>{icon}</Box>
                          <Box>
                            <Typography variant="body2" color="#94a3b8">
                              {label}
                            </Typography>
                            <Typography variant="body1" fontWeight={500} color="#e2e8f0">
                              {isPassword ? '••••••••' : userSession?.[field] || 'No especificado'}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Container>
        </Fade>
      </LoaderWrapper>
    </Box>
  );
};

export default UserProfile;