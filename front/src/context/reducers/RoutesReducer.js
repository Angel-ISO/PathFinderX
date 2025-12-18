export const RoutesReducer = (state = InitialState.savedRoutes, action) => {
  switch (action.type) {
    case 'FETCH_ROUTES_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_ROUTES_SUCCESS':
      // 🔥 CORREGIDO: Manejar múltiples estructuras de respuesta
      const routesData = action.payload.registers || action.payload.data || [];
      
      return {
        ...state,
        loading: false,
        data: routesData,
        pagination: {
          currentPage: action.payload.pageIndex || action.payload.pagination?.currentPage || 1,
          pageSize: action.payload.pageSize || action.payload.pagination?.pageSize || 10,
          totalCount: action.payload.total || action.payload.pagination?.totalCount || 0,
          totalPages: action.payload.totalPages || action.payload.pagination?.totalPages || 0,
          search: action.payload.search || action.payload.pagination?.search || ''
        }
      };
    case 'FETCH_ROUTES_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'ADD_ROUTE_SUCCESS':
      return {
        ...state,
        data: [action.payload, ...state.data]
      };
    case 'DELETE_ROUTE_SUCCESS':
      return {
        ...state,
        data: state.data.filter(route => route.id !== action.payload)
      };
    default:
      return state;
  }
};