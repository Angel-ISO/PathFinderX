export const UserSessionReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        ...action.payload,
        authenticated: true
      };
    case 'LOGOUT':
      return {
        id: '',
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        jwt: '',
        authenticated: false
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};