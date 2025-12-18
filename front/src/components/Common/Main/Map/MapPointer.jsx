import { useState, useEffect } from 'react';
import { useStore } from '../../../../context/Store.jsx';
import { CalculatePathAct } from '../../../../actions/PathActions.js';
import { toast } from 'react-hot-toast';

const useMapPointer = () => {
  const { state, dispatch } = useStore();
  const [points, setPoints] = useState({
    start: null,
    end: null,
    stops: [],
    obstacles: []
  });
  const [mode, setMode] = useState('start'); 

  const handleMapClick = (latlng) => {
    const newPoint = { lat: latlng.lat, lon: latlng.lng };
    
    switch(mode) {
      case 'start':
        setPoints(prev => ({ ...prev, start: newPoint }));
        setMode('end');
        break;
      case 'end':
        setPoints(prev => ({ ...prev, end: newPoint }));
        setMode('stop');
        break;
      case 'stop':
        setPoints(prev => ({ ...prev, stops: [...prev.stops, newPoint] }));
        break;
      case 'obstacle':
        setPoints(prev => ({ ...prev, obstacles: [...prev.obstacles, newPoint] }));
        break;
      default:
        break;
    }
  };

  const calculateRoute = async () => {
    if (!points.start || !points.end) {
      toast.error('Debes seleccionar al menos un punto de inicio y uno de fin');
      return;
    }

    dispatch({ type: 'SET_DRAW_LOADING', payload: true });

    try {
      const response = await CalculatePathAct(points);
      
      if (response.success) {
        dispatch({ 
          type: 'SET_DRAW_PATH', 
          payload: {
            route: response.data.route,
            totalDistance: response.data.totalDistance,
            params: points
          }
        });
      }
    } catch (error) {
      dispatch({ type: 'SET_DRAW_ERROR', payload: error.message });
    }
  };

  const resetPoints = () => {
    setPoints({
      start: null,
      end: null,
      stops: [],
      obstacles: []
    });
    setMode('start');
    dispatch({ type: 'CLEAR_DRAW_PATH' });
  };

  const removeStop = (index) => {
    setPoints(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index)
    }));
  };

  const removeObstacle = (index) => {
    setPoints(prev => ({
      ...prev,
      obstacles: prev.obstacles.filter((_, i) => i !== index)
    }));
  };

  const removeStartPoint = () => {
    setPoints(prev => ({ ...prev, start: null }));
    if (mode !== 'start') {
      setMode('start');
    }
  };

  const removeEndPoint = () => {
    setPoints(prev => ({ ...prev, end: null }));
    if (mode !== 'end') {
      setMode('end');
    }
  };

  return {
    points,
    mode,
    setMode,
    handleMapClick,
    calculateRoute,
    resetPoints,
    removeStop,
    removeObstacle,
    removeStartPoint,
    removeEndPoint,
    currentRoute: state.currentDrawPath,
    isCalculating: state.drawLoading || false,
    canCalculateRoute: !!(points.start && points.end),
    hasPoints: !!(points.start || points.end || points.stops.length > 0 || points.obstacles.length > 0),
    error: state.drawError || null,
    routeStats: state.currentDrawPath ? {
      totalDistance: state.currentDrawPath.totalDistance,
      routeLength: state.currentDrawPath.route?.length || 0
    } : null
  };
};

export default useMapPointer;