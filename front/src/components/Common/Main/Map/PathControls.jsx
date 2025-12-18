import { 
  Button, 
  Stack, 
  Typography, 
  Chip, 
  Card, 
  CardContent, 
  Box,
  Divider,
  IconButton,
  Tooltip,
  Fade,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Stop as EndIcon,
  LocationOn as StopIcon,
  Warning as ObstacleIcon,
  Route as RouteIcon,
  Refresh as ResetIcon,
  Delete as DeleteIcon,
  Timeline as CalculateIcon
} from '@mui/icons-material';

const PathControls = ({ 
  mode, 
  setMode, 
  points, 
  calculateRoute, 
  resetPoints, 
  removeStop,
  removeObstacle,
  currentRoute,
  isLoading = false
}) => {
  const modeConfigs = {
    start: { 
      icon: <StartIcon />, 
      label: 'Punto de Inicio', 
      color: 'success',
      description: 'Selecciona el punto de partida'
    },
    end: { 
      icon: <EndIcon />, 
      label: 'Punto Final', 
      color: 'error',
      description: 'Selecciona el destino'
    },
    stop: { 
      icon: <StopIcon />, 
      label: 'Agregar Paradas', 
      color: 'primary',
      description: 'Agrega paradas intermedias'
    },
    obstacle: { 
      icon: <ObstacleIcon />, 
      label: 'Agregar Obstáculos', 
      color: 'warning',
      description: 'Marca obstáculos a evitar'
    }
  };

  const getPointsList = () => {
    const pointsList = [];
    
    if (points.start) {
      pointsList.push({
        type: 'start',
        label: 'Punto de inicio',
        icon: <StartIcon color="success" />,
        coords: `${points.start.lat.toFixed(4)}, ${points.start.lon.toFixed(4)}`
      });
    }

    if (points.stops?.length > 0) {
      points.stops.forEach((stop, index) => {
        pointsList.push({
          type: 'stop',
          label: `Parada ${index + 1}`,
          icon: <StopIcon color="primary" />,
          coords: `${stop.lat.toFixed(4)}, ${stop.lon.toFixed(4)}`,
          index
        });
      });
    }

    if (points.end) {
      pointsList.push({
        type: 'end',
        label: 'Punto final',
        icon: <EndIcon color="error" />,
        coords: `${points.end.lat.toFixed(4)}, ${points.end.lon.toFixed(4)}`
      });
    }

    if (points.obstacles?.length > 0) {
      points.obstacles.forEach((obstacle, index) => {
        pointsList.push({
          type: 'obstacle',
          label: `Obstáculo ${index + 1}`,
          icon: <ObstacleIcon color="warning" />,
          coords: `${obstacle.lat.toFixed(4)}, ${obstacle.lon.toFixed(4)}`,
          index
        });
      });
    }

    return pointsList;
  };

  const removePoint = (type, index = null) => {
    if (type === 'stop' && typeof index === 'number') {
      removeStop && removeStop(index);
    } else if (type === 'obstacle' && typeof index === 'number') {
      removeObstacle && removeObstacle(index);
    }
  };

  const canCalculateRoute = points.start && points.end && !isLoading;
  const hasRoute = currentRoute?.route?.length > 0;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexShrink: 0, p: 3, pb: 0 }}>
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <RouteIcon /> Planificador de Rutas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Crea rutas optimizadas para Bucaramanga
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>

      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          px: 3,
          py: 2
        }}
      >
        <Stack spacing={3}>
          <Card elevation={2} sx={{ bgcolor: 'background.paper' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography 
                variant="subtitle2" 
                gutterBottom
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Selecciona el modo:
              </Typography>
              
              <Stack spacing={1.5}>
                {Object.entries(modeConfigs).map(([modeKey, config]) => (
                  <Button
                    key={modeKey}
                    variant={mode === modeKey ? 'contained' : 'outlined'}
                    color={config.color}
                    onClick={() => setMode(modeKey)}
                    startIcon={config.icon}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      p: 1.5,
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      fontWeight: mode === modeKey ? 600 : 400,
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        transition: 'transform 0.2s ease'
                      }
                    }}
                  >
                    <Box sx={{ textAlign: 'left', ml: 1 }}>
                      <Typography variant="body2" component="div">
                        {config.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {config.description}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={2} sx={{ bgcolor: 'background.paper' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography 
                variant="subtitle2" 
                gutterBottom
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Puntos agregados ({getPointsList().length})
              </Typography>
              
              {getPointsList().length === 0 ? (
                <Box 
                  sx={{ 
                    textAlign: 'center', 
                    py: 3,
                    color: 'text.secondary' 
                  }}
                >
                  <Typography variant="body2">
                    No hay puntos agregados
                  </Typography>
                  <Typography variant="caption">
                    Click en el mapa para comenzar
                  </Typography>
                </Box>
              ) : (
                <List dense sx={{ p: 0 }}>
                  {getPointsList().map((point, index) => (
                    <ListItem 
                      key={`${point.type}-${point.index || 0}-${index}`}
                      sx={{ 
                        px: 0,
                        py: 1,
                        bgcolor: point.type === mode ? 'action.selected' : 'transparent',
                        borderRadius: 1,
                        mb: 0.5
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {point.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {point.label}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {point.coords}
                          </Typography>
                        }
                      />
                      {(point.type === 'stop' || point.type === 'obstacle') && (
                        <ListItemSecondaryAction>
                          <Tooltip title="Eliminar">
                            <IconButton 
                              size="small" 
                              onClick={() => removePoint(point.type, point.index)}
                              sx={{ color: 'error.main' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>

          {isLoading && (
            <Fade in={isLoading}>
              <Card elevation={1} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                    Calculando ruta óptima...
                  </Typography>
                  <LinearProgress 
                    color="inherit" 
                    sx={{ 
                      mt: 1,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'primary.contrastText'
                      }
                    }} 
                  />
                </CardContent>
              </Card>
            </Fade>
          )}

          {hasRoute && !isLoading && (
            <Fade in={hasRoute}>
              <Card 
                elevation={3} 
                sx={{ 
                  bgcolor: 'success.main', 
                  color: 'success.contrastText',
                  border: 2,
                  borderColor: 'success.light'
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography 
                    variant="subtitle2" 
                    gutterBottom
                    sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <RouteIcon /> Ruta Calculada
                  </Typography>
                  
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {(currentRoute.totalDistance / 1000).toFixed(2)} km
                      </Typography>
                      <Typography variant="caption">
                        {currentRoute.totalDistance.toFixed(0)} metros
                      </Typography>
                    </Box>
                    
                    <Divider orientation="vertical" flexItem sx={{ bgcolor: 'success.contrastText', opacity: 0.3 }} />
                    
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {currentRoute.route?.length || 0}
                      </Typography>
                      <Typography variant="caption">
                        puntos de navegación
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Fade>
          )}
        </Stack>
      </Box>

      <Box sx={{ flexShrink: 0, p: 3, pt: 0 }}>
        <Stack spacing={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={calculateRoute}
            disabled={!canCalculateRoute}
            startIcon={<CalculateIcon />}
            size="large"
            sx={{
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: canCalculateRoute ? 3 : 0,
              '&:hover': {
                boxShadow: canCalculateRoute ? 6 : 0,
                transform: canCalculateRoute ? 'translateY(-2px)' : 'none',
              },
              transition: 'all 0.3s ease'
            }}
          >
            {isLoading ? 'Calculando...' : 'Calcular Ruta'}
          </Button>
          
          <Button 
            variant="outlined" 
            color="error" 
            onClick={resetPoints}
            startIcon={<ResetIcon />}
            disabled={isLoading}
            sx={{
              py: 1.5,
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Reiniciar Todo
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default PathControls;