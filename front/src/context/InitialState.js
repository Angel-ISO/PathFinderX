export const InitialState = {
  userSession: {
    id: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    authenticated: false,
  },
  openSnackbar: {
    open: false,
    message: '',
    severity: 'info',
    duration: 3000,
  },
  currentDrawPath: {
    route: [],              
    totalDistance: 0,
    params: null,          
    updatedAt: null,       
    loading: false,         
    error: null,
  },
  savedRoutes: {
    data: [],                
    pagination: {            
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      search: ''
    },
    loading: false,
    error: null
  }
};