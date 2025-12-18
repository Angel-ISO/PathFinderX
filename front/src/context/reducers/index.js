import { OpenSnackbar } from "./OpenSnackbarReducer";
import { UserSessionReducer } from "./UserSessionReducer";
import { MapReducer } from "./MapReducer";
import { RoutesReducer } from "./RoutesReducer";


export const MainReducer = (state, action) => ({
  openSnackbar: OpenSnackbar(state.openSnackbar, action),
  userSession: UserSessionReducer(state.userSession, action),
  currentDrawPath: MapReducer(state.currentDrawPath, action),
  savedRoutes: RoutesReducer(state.savedRoutes, action)
});
