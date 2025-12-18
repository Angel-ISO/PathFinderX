import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton,
  useTheme,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Pagination,
  Stack,
  Tooltip
} from '@mui/material';
import { 
  Save, 
  Delete, 
  Search, 
  Route as RouteIcon,
  Visibility,
  Timeline
} from '@mui/icons-material';
import { useStore } from '../../../../context/Store.jsx';
import { fetchRoutesByUser, deleteRoute } from '../../../../actions/RoutesActions.js';
import RouteConfigurator from './RouteConfigurator.jsx';
import {showConfirmationAlert} from '../../../../utils/Alerts.js';

const RoutesPanelIsolated = React.memo(({ currentDrawPath: externalDrawPath }) => {
  const theme = useTheme();
  const { dispatch } = useStore(); 
  
  const [localState, setLocalState] = useState({
    routes: [],
    pagination: { currentPage: 1, totalPages: 1, total: 0 },
    loading: false,
    error: null,
    currentDrawPath: null
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimeoutRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const loadRoutes = useCallback(async (page = 1, search = '') => {
    if (!mountedRef.current) return;
    
    setLocalState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await fetchRoutesByUser(page, 10, search);
      
      if (!mountedRef.current) return;
      
      if (result.success) {
        const routesData = result.registers || result.data || [];
        
        setLocalState(prev => ({
          ...prev,
          routes: routesData,
          pagination: {
            currentPage: result.pageIndex || page,
            totalPages: result.totalPages || Math.ceil((result.total || 0) / (result.pageSize || 10)),
            total: result.total || 0
          },
          loading: false,
          error: null
        }));
        setIsInitialLoad(false);
        
        console.log('✅ Rutas cargadas:', routesData.length); 
      } else {
        throw new Error(result.message || 'Error al cargar rutas');
      }
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('❌ Error cargando rutas:', error); 
      setLocalState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al cargar rutas'
      }));
    }
  }, []);

  useEffect(() => {
    if (isInitialLoad && mountedRef.current) {
      console.log('🚀 Cargando rutas inicial...'); 
      loadRoutes(1, '');
    }
  }, [loadRoutes, isInitialLoad]);

  const handleSearchDebounced = useCallback((value) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchTerm(value);
    
    searchTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        console.log('🔍 Buscando:', value); 
        loadRoutes(1, value);
      }
    }, 500);
  }, [loadRoutes]);

  const handleDeleteRoute = useCallback(async (routeId) => {
      const routeToDelete = localState.routes.find(r => r.id === routeId);

  const confirmation = await showConfirmationAlert(
    `¿Estás seguro de que deseas eliminar la ruta "${routeToDelete?.name}"?`,
    'Sí, eliminar'
  );

  if (!confirmation.isConfirmed) {
    return;
  }

    try {
      const result = await deleteRoute(routeId);
      
      if (!mountedRef.current) return;
      
      if (result.success) {
        console.log('🗑️ Ruta eliminada:', routeId); 
        
        setLocalState(prev => ({
          ...prev,
          routes: prev.routes.filter(route => route.id !== routeId),
          pagination: {
            ...prev.pagination,
            total: prev.pagination.total - 1
          }
        }));
        
        const remainingRoutes = localState.routes.length - 1;
        if (remainingRoutes === 0 && localState.pagination.currentPage > 1) {
          loadRoutes(localState.pagination.currentPage - 1, searchTerm);
        }
      }
    } catch (error) {
      console.error('❌ Error eliminando ruta:', error);
    }
  }, [localState.pagination.currentPage, localState.routes.length, loadRoutes, searchTerm]);

  const handlePageChange = useCallback((event, newPage) => {
    console.log('📄 Cambio de página:', newPage); 
    loadRoutes(newPage, searchTerm);
  }, [loadRoutes, searchTerm]);

  const handleRouteCreated = useCallback((newRoute) => {
    if (!mountedRef.current) return;
    
    if (newRoute) {
      console.log('✅ Nueva ruta creada:', newRoute.name); 
      
      setLocalState(prev => ({
        ...prev,
        routes: [newRoute, ...prev.routes],
        pagination: {
          ...prev.pagination,
          total: prev.pagination.total + 1
        }
      }));
    } else {
      console.log('🔄 Recargando rutas después de crear...'); 
      loadRoutes(1, searchTerm);
    }
  }, [loadRoutes, searchTerm]);

  const handleLoadRoute = useCallback((route) => {
    console.log('🗺️ Cargando ruta en mapa:', route.name);
    
    setLocalState(prev => ({
      ...prev,
      currentDrawPath: {
        route: route.route,
        totalDistance: route.totalDistance,
        params: route.params,
      }
    }));
    
    dispatch({
      type: 'SET_DRAW_PATH',
      payload: {
        route: route.route,
        totalDistance: route.totalDistance,
        params: route.params,
      }
    });
  }, [dispatch]);

  const formatDistance = useCallback((distance) => {
    if (!distance) return '0 km';
    return distance > 1000 
      ? `${(distance / 1000).toFixed(1)} km`
      : `${Math.round(distance)} m`;
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const routesList = useMemo(() => {
    console.log('📋 Renderizando lista con', localState.routes.length, 'rutas'); 
    
    if (localState.routes.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 1 }}>
          {searchTerm ? 'No se encontraron rutas' : 'No tienes rutas guardadas'}
        </Alert>
      );
    }

    return localState.routes.map(route => (
      <ListItem
        key={route.id}
        sx={{
          bgcolor: theme.palette.background.default,
          mb: 1,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          flexDirection: 'column',
          alignItems: 'stretch',
          p: 1.5,
          '&:hover': {
            bgcolor: theme.palette.action.hover,
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          width: '100%',
          mb: 1 
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 0.5,
                wordBreak: 'break-word'
              }}
            >
              {route.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(route.createdAt)}
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Cargar en mapa">
              <IconButton 
                size="small" 
                onClick={() => handleLoadRoute(route)}
                sx={{ 
                  color: theme.palette.primary.main,
                  '&:hover': { 
                    bgcolor: theme.palette.primary.main + '15',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar ruta">
              <IconButton 
                size="small" 
                onClick={() => handleDeleteRoute(route.id)}
                sx={{ 
                  color: theme.palette.error.main,
                  '&:hover': { 
                    bgcolor: theme.palette.error.main + '15',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<Timeline />}
            label={formatDistance(route.totalDistance)}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<RouteIcon />}
            label={`${route.route?.length || 0} puntos`}
            size="small"
            color="secondary"
            variant="outlined"
          />
        </Box>
      </ListItem>
    ));
  }, [localState.routes, searchTerm, theme, formatDistance, formatDate, handleLoadRoute, handleDeleteRoute]);

  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: theme.palette.background.paper
      }}
    >
      <Box sx={{ flexShrink: 0, p: 2, pb: 1 }}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <RouteIcon /> Mis Rutas
          {process.env.NODE_ENV === 'development' && (
            <Chip 
              label={`${localState.routes.length}/${localState.pagination.total}`}
              size="small" 
              color="info" 
              variant="outlined"
            />
          )}
        </Typography>
        
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar rutas..."
          value={searchTerm}
          onChange={(e) => handleSearchDebounced(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1 }}
        />
        
        <Divider />
      </Box>

      <Box sx={{ flexShrink: 0, px: 2 }}>
        <RouteConfigurator 
          onRouteCreated={handleRouteCreated}
          currentDrawPath={externalDrawPath || localState.currentDrawPath}
        />
        <Divider sx={{ mt: 2 }} />
      </Box>

      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          px: 2,
          py: 1
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.8 }}>
          {localState.loading ? 'Cargando...' : `${localState.pagination.total} rutas encontradas`}
        </Typography>
        
        {localState.loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : localState.error ? (
          <Alert severity="error" sx={{ mt: 1 }}>
            {localState.error}
          </Alert>
        ) : (
          <List sx={{ p: 0 }}>
            {routesList}
          </List>
        )}
      </Box>

      {localState.pagination.totalPages > 1 && (
        <Box sx={{ flexShrink: 0, p: 2, pt: 1 }}>
          <Stack alignItems="center">
            <Pagination
              count={localState.pagination.totalPages}
              page={localState.pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
              size="small"
              disabled={localState.loading}
            />
          </Stack>
        </Box>
      )}
    </Box>
  );
});

RoutesPanelIsolated.displayName = 'RoutesPanelIsolated';

export default RoutesPanelIsolated;