import { useStore } from "../context/Store.jsx";
import { Redirect } from "wouter";


export const ProtectedRoute = ({ component: Component }) => {
  const { state } = useStore();
  const { userSession } = state;

  if (!userSession?.authenticated) {
    return <Redirect to="/login" />;
  }

  return <Component />;
};

export const GuestRoute = ({ component: Component }) => {
  const { state } = useStore();
  const { userSession } = state;

  if (userSession?.authenticated) {
    return <Redirect to="/profile" />;
  }

  return <Component />;
};
