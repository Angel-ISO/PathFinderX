export const MapReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_DRAW_PATH':
      return {
        ...state,
        route: action.payload.route || [],
        totalDistance: action.payload.totalDistance || 0,
        params: action.payload.params || null,
        updatedAt: Date.now(),
        loading: false,
        error: null
      };
    case 'CLEAR_DRAW_PATH':
      return {
        route: [],
        totalDistance: 0,
        params: null,
        updatedAt: null,
        loading: false,
        error: null
      };
    case 'SET_DRAW_LOADING':
      return {
        ...state,
        loading: action.payload ?? true
      };
    case 'SET_DRAW_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};