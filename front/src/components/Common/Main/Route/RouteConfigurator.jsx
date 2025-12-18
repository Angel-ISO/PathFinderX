import React, { useState, useCallback, useMemo } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  Chip,
  Divider,
  Tooltip
} from '@mui/material';
import { Save, Add, Route as RouteIcon } from '@mui/icons-material';
import { useStore } from '../../../../context/Store.jsx';
import { createRoute } from '../../../../actions/RoutesActions.js';

// 🔥 COMPONENTE COMPLETAMENTE AISLADO - Solo se re-renderiza cuando es necesario
const RouteConfiguratorIsolated = React.memo(({ onRouteCreated, currentDrawPath }) => {
  const { dispatch } = useStore(); // Solo dispatch, NO el estado completo
  const [routeName, setRouteName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // 🔥 Memoizar la validación para evitar re-cálculos innecesarios
  const canCreateRoute = useMemo(() => {
    return (
      routeName.trim().length > 0 && 
      currentDrawPath?.route?.length > 0 && 
      currentDrawPath?.totalDistance > 0
    );
  }, [routeName, currentDrawPath?.route?.length, currentDrawPath?.totalDistance]);

  // 🔥 Handler completamente memoizado para crear rutas
  const handleCreateRoute = useCallback(async () => {
    if (!canCreateRoute) return;

    setIsCreating(true);
    try {
      const result = await createRoute(routeName.trim(), currentDrawPath);
      
      if (result.success) {
        // Limpiar el formulario
        setRouteName('');
        
        // Notificar al componente padre con la ruta creada
        onRouteCreated(result.data);
        
        // NO actualizar el store global aquí - solo notificar
      }
    } catch (error) {
      console.error('Error creating route:', error);
    } finally {
      setIsCreating(false);
    }
  }, [canCreateRoute, routeName, currentDrawPath, onRouteCreated]);

  // 🔥 Handler memoizado para cambio de nombre
  const handleNameChange = useCallback((event) => {
    setRouteName(event.target.value);
  }, []);

  // 🔥 Información de la ruta memoizada
  const routeInfo = useMemo(() => {
    if (!currentDrawPath) return null;
    
    return {
      distance: currentDrawPath.totalDistance,
      points: currentDrawPath.route?.length || 0,
      hasStops: currentDrawPath.params?.stops?.length > 0,
      hasObstacles: currentDrawPath.params?.obstacles?.length > 0
    };
  }, [currentDrawPath]);

  // Si no hay ruta calculada, no mostrar el configurador
  if (!currentDrawPath) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Calcula una ruta para poder guardarla
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          fontWeight: 600, 
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Save /> Guardar Ruta
      </Typography>

      {/* Información de la ruta actual */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          <Chip
            size="small"
            icon={<RouteIcon />}
            label={`${(routeInfo.distance / 1000).toFixed(2)} km`}
            color="primary"
            variant="outlined"
          />
          <Chip
            size="small"
            label={`${routeInfo.points} puntos`}
            color="secondary"
            variant="outlined"
          />
          {routeInfo.hasStops && (
            <Chip
              size="small"
              label="Con paradas"
              color="info"
              variant="outlined"
            />
          )}
          {routeInfo.hasObstacles && (
            <Chip
              size="small"
              label="Con obstáculos"
              color="warning"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      <TextField
        fullWidth
        size="small"
        label="Nombre de la ruta"
        placeholder="Ej: Casa al trabajo"
        value={routeName}
        onChange={handleNameChange}
        disabled={isCreating}
        sx={{ mb: 2 }}
        inputProps={{ maxLength: 100 }}
      />

      <Tooltip 
        title={!canCreateRoute ? "Ingresa un nombre para la ruta" : ""}
        arrow
      >
        <span style={{ width: '100%' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleCreateRoute}
            disabled={!canCreateRoute || isCreating}
            startIcon={<Add />}
            sx={{
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: canCreateRoute ? 2 : 0,
              '&:hover': {
                boxShadow: canCreateRoute ? 4 : 0,
                transform: canCreateRoute ? 'translateY(-1px)' : 'none',
              },
              transition: 'all 0.2s ease'
            }}
          >
            {isCreating ? 'Guardando...' : 'Guardar Ruta'}
          </Button>
        </span>
      </Tooltip>

      {!canCreateRoute && routeName.trim().length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Ingresa un nombre para guardar la ruta calculada
        </Alert>
      )}
    </Box>
  );
});

// 🔥 DisplayName para debugging
RouteConfiguratorIsolated.displayName = 'RouteConfiguratorIsolated';

export default RouteConfiguratorIsolated;