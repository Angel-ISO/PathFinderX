import { Box, Paper, useTheme, useMediaQuery, Zoom, Fab } from '@mui/material';
import { Route as RouteIcon, MyLocation as MyLocationIcon } from '@mui/icons-material';
import MapComponent from './MapComponent.jsx';
import PathControls from './PathControls.jsx';
import useMapPointer from './MapPointer.jsx';
import { useState, useEffect } from 'react';
import { useStore } from '../../../../context/Store.jsx';


const PathPlanner = ({ pathControlsProps, currentDrawPath }) => {
  const { state } = useStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showControls, setShowControls] = useState(!isMobile);
  const [userLocation, setUserLocation] = useState(null);

  const mapPointerData = useMapPointer();
  const {
    points,
    mode,
    setMode,
    handleMapClick,
    calculateRoute,
    resetPoints,
    removeStop,
    removeObstacle,
    currentRoute,
    isCalculating,
    canCalculateRoute,
    hasPoints,
    error,
    routeStats
  } = pathControlsProps || mapPointerData;

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (latitude >= 7.05 && latitude <= 7.17 && longitude >= -73.15 && longitude <= -73.05) {
          setUserLocation({ lat: latitude, lon: longitude });
        }
      },
      () => {
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    setShowControls(!isMobile);
  }, [isMobile]);

  const controlsWidth = isMobile ? '100%' : '400px';

  const routeDataForMap = currentDrawPath ?? state.currentDrawPath;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        height: '100%',
        position: 'relative',
        bgcolor: 'background.default'
      }}
    >
      {!isMobile && (
        <Zoom in={showControls}>
          <Paper
            elevation={4}
            sx={{
              width: showControls ? controlsWidth : 0,
              minWidth: showControls ? controlsWidth : 0,
              height: '100%',
              overflow: 'hidden',
              transition: theme.transitions.create(['width', 'min-width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
              borderRight: showControls ? `1px solid ${theme.palette.divider}` : 'none',
              zIndex: 1000,
              bgcolor: 'background.paper'
            }}
          >
            {showControls && (
              <PathControls
                mode={mode}
                setMode={setMode}
                points={points}
                calculateRoute={calculateRoute}
                resetPoints={resetPoints}
                removeStop={removeStop}
                removeObstacle={removeObstacle}
                currentRoute={currentRoute}
                isLoading={isCalculating}
                canCalculateRoute={canCalculateRoute}
                hasPoints={hasPoints}
                error={error}
                routeStats={routeStats}
              />
            )}
          </Paper>
        </Zoom>
      )}

      <Box 
        sx={{ 
          flex: 1,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 'calc(100vh - 56px)', sm: 'auto' }
        }}
      >
        <MapComponent 
          onMapClick={handleMapClick} 
          routeData={routeDataForMap}
          isLoading={isCalculating}
          points={points}
          userLocation={userLocation}
        />

        {!isMobile && (
          <Fab
            color="primary"
            size="medium"
            onClick={() => setShowControls(!showControls)}
            sx={{
              position: 'absolute',
              top: 16,
              left: showControls ? `calc(${controlsWidth} - 24px)` : 16,
              transition: theme.transitions.create('left', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
              zIndex: 1001,
              boxShadow: theme.shadows[6],
              '&:hover': {
                boxShadow: theme.shadows[8],
                transform: 'scale(1.05)',
              }
            }}
          >
            <RouteIcon />
          </Fab>
        )}

        {userLocation && (
          <Fab
            color="secondary"
            size="small"
            onClick={() => {
              if (mode === 'start' && !points.start) {
                handleMapClick(userLocation);
              }
            }}
            sx={{
              position: 'absolute',
              bottom: isMobile ? 100 : 80, 
              right: 16,
              zIndex: 1001,
              boxShadow: theme.shadows[4],
              '&:hover': {
                boxShadow: theme.shadows[6],
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease'
            }}
          >
            <MyLocationIcon fontSize="small" />
          </Fab>
        )}
      </Box>
    </Box>
  );
};

export default PathPlanner;