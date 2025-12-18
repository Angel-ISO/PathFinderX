import { AppBar, Toolbar, Typography, Box, IconButton, Button, Menu, MenuItem, Avatar } from '@mui/material';
import { 
  Route as RouteIcon, 
  ArrowBack as ArrowBackIcon, 
  Home as HomeIcon, 
  AccountCircle, 
  Person as ProfileIcon, 
  Logout 
} from '@mui/icons-material';
import { useState } from 'react';

const Header = ({ 
  title = "PathFinderX",
  backButtonConfig = null,
  userConfig = null,
  additionalActions = null
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(2, 6, 23, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(74, 222, 128, 0.1)",
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Sección izquierda */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
           {backButtonConfig && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                edge="start"
                aria-label={backButtonConfig.ariaLabel || "Volver"}
                onClick={backButtonConfig.onClick}
                disabled={backButtonConfig.disabled}
                sx={{ 
                  mr: 1,
                  color: backButtonConfig.color || '#4ade80',
                  '&:hover': {
                    backgroundColor: backButtonConfig.hoverColor || 'rgba(74, 222, 128, 0.1)'
                  },
                  ...backButtonConfig.sx
                }}
              >
                {backButtonConfig.icon || <ArrowBackIcon />}
              </IconButton>
              
              {backButtonConfig.text && (
                <Typography 
                  variant="body1"
                  sx={{ 
                    color: backButtonConfig.textColor || '#4ade80',
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    },
                    ...backButtonConfig.textSx
                  }}
                  onClick={backButtonConfig.onClick}
                >
                  {backButtonConfig.text}
                </Typography>
              )}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RouteIcon sx={{ color: "#4ade80", mr: 1, fontSize: 28 }} />
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 600,
                background: "linear-gradient(45deg, #4ade80, #22d3ee)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>

        {/* Sección derecha */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {additionalActions}

          {userConfig && (
            <>
              <Button
                aria-label="Menú de usuario"
                aria-controls="user-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
               startIcon={
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: 'primary.main',
                      fontSize: 14
                    }}
                    alt={userConfig.name}
                  >
                    {userConfig.name?.charAt(0).toUpperCase()}
                  </Avatar>
                }
                sx={{
                  color: '#4ade80',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(74, 222, 128, 0.1)'
                  }
                }}
              >
                {userConfig.name}
              </Button>
              
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    minWidth: 200,
                    overflow: 'visible',
                    bgcolor: 'rgba(2, 6, 23, 0.95)',
                    border: '1px solid rgba(74, 222, 128, 0.2)',
                    mt: 1.5,
                    '& .MuiMenuItem-root': {
                      '&:hover': {
                        bgcolor: 'rgba(74, 222, 128, 0.1)'
                      }
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'rgba(2, 6, 23, 0.95)',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                      borderLeft: '1px solid rgba(74, 222, 128, 0.2)',
                      borderTop: '1px solid rgba(74, 222, 128, 0.2)'
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem 
                  onClick={() => {
                    handleMenuClose();
                    userConfig.onProfile();
                  }}
                >
                  <ProfileIcon fontSize="small" sx={{ mr: 1.5, color: '#4ade80' }} />
                  Mi Perfil
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleMenuClose();
                    userConfig.onLogout();
                  }}
                >
                  <Logout fontSize="small" sx={{ mr: 1.5, color: '#4ade80' }} />
                  Cerrar sesión
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;