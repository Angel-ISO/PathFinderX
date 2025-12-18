export const OpenSnackbar = (state, action) => {
  switch (action.type) {
    case 'OPEN_SNACKBAR':
      return {
        ...state,
        open: true,
        message: action.payload.message,
        severity: action.payload.severity,
        duration: action.payload.duration,
      };
    case 'CLOSE_SNACKBAR':
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
};