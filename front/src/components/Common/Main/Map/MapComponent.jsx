import { useEffect, useRef, useState } from 'react';
import { Box, Paper, Fade, CircularProgress, Typography } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const BUCARAMANGA_BOUNDS = [
  [7.05, -73.15], 
  [7.17, -73.05]  
];

const BUCARAMANGA_CENTER = [7.119, -73.1198];

const MapComponent = ({ onMapClick, routeData, isLoading, points }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const routeLayer = useRef(null);
  const markersRef = useRef([]);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: BUCARAMANGA_CENTER,
      zoom: 13,
      maxBounds: BUCARAMANGA_BOUNDS,
      maxBoundsViscosity: 1.0,
      minZoom: 12,
      maxZoom: 18,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapInstance.current);

    mapInstance.current.on('click', (e) => {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    });

    mapInstance.current.fitBounds(BUCARAMANGA_BOUNDS, { padding: [20, 20] });
    setIsMapReady(true);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [onMapClick]);

  useEffect(() => {
    if (!mapRef.current || !mapInstance.current) return;

    const observer = new ResizeObserver(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    });

    observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, [isMapReady]);

  const clearMarkers = () => {
    if (markersRef.current && markersRef.current.length > 0) {
      markersRef.current.forEach(marker => {
        if (mapInstance.current && mapInstance.current.hasLayer(marker)) {
          mapInstance.current.removeLayer(marker);
        }
      });
      markersRef.current = [];
    }
  };

  const clearRoute = () => {
    if (routeLayer.current && mapInstance.current) {
      if (mapInstance.current.hasLayer(routeLayer.current)) {
        mapInstance.current.removeLayer(routeLayer.current);
      }
      routeLayer.current = null;
    }
  };

  useEffect(() => {
    if (!mapInstance.current || !isMapReady) return;
    
    clearMarkers();

    const createSimpleIcon = (color) => L.divIcon({
      className: 'simple-marker',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    if (points?.start) {
      const startMarker = L.marker([points.start.lat, points.start.lon], {
        icon: createSimpleIcon('#22c55e')
      }).addTo(mapInstance.current);
      
      startMarker.bindPopup(`<strong>Inicio:</strong><br/>${points.start.lat.toFixed(6)}, ${points.start.lon.toFixed(6)}`);
      markersRef.current.push(startMarker);
    }

    if (points?.end) {
      const endMarker = L.marker([points.end.lat, points.end.lon], {
        icon: createSimpleIcon('#ef4444')
      }).addTo(mapInstance.current);
      
      endMarker.bindPopup(`<strong>Destino:</strong><br/>${points.end.lat.toFixed(6)}, ${points.end.lon.toFixed(6)}`);
      markersRef.current.push(endMarker);
    }

    if (points?.stops?.length > 0) {
      points.stops.forEach((stop, index) => {
        const stopMarker = L.marker([stop.lat, stop.lon], {
          icon: createSimpleIcon('#3b82f6')
        }).addTo(mapInstance.current);
        
        stopMarker.bindPopup(`<strong>Parada ${index + 1}:</strong><br/>${stop.lat.toFixed(6)}, ${stop.lon.toFixed(6)}`);
        markersRef.current.push(stopMarker);
      });
    }

    if (points?.obstacles?.length > 0) {
      points.obstacles.forEach((obstacle, index) => {
        const obstacleMarker = L.marker([obstacle.lat, obstacle.lon], {
          icon: createSimpleIcon('#f59e0b')
        }).addTo(mapInstance.current);
        
        obstacleMarker.bindPopup(`<strong>Obstáculo ${index + 1}:</strong><br/>${obstacle.lat.toFixed(6)}, ${obstacle.lon.toFixed(6)}`);
        markersRef.current.push(obstacleMarker);
      });
    }
  }, [points, isMapReady]);

  useEffect(() => {
    if (!mapInstance.current || !isMapReady) return;

    if (!routeData || !Array.isArray(routeData.route) || !routeData.route.length) {
      clearRoute();
      return;
    }

    clearRoute();

    const coordinates = routeData.route
      .map(point => {
        if (point && typeof point.lat === 'number' && typeof point.lon === 'number') {
          return [point.lat, point.lon];
        }
        return null;
      })
      .filter(coord => coord !== null);

    if (coordinates.length < 2) {
      return;
    }

    try {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }

      routeLayer.current = L.polyline(coordinates, {
        color: '#2563eb',
        weight: 6,
        opacity: 0.8,
        smoothFactor: 1.0,
        lineJoin: 'round',
        lineCap: 'round'
      }).addTo(mapInstance.current);

      const bounds = L.latLngBounds(coordinates);
      mapInstance.current.fitBounds(bounds, { 
        padding: [20, 20],
        maxZoom: 16
      });

      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.invalidateSize(true);
        }
      }, 0);
    } catch (error) {
      console.error('Error drawing route:', error);
    }
  }, [routeData, isMapReady]);

  useEffect(() => {
    const handleResize = () => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Box
        ref={mapRef}
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
          overflow: 'hidden'
        }}
      />

      <Fade in={isLoading}>
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            zIndex: 1000,
            minWidth: 200
          }}
        >
          <CircularProgress 
            size={40} 
            thickness={4}
            sx={{ color: '#1976d2' }} 
          />
          <Typography variant="body2" color="text.primary">
            Calculando ruta...
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default MapComponent;