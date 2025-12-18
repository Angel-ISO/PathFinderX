import { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { Route, Switch, Redirect } from "wouter";
import theme from "../theme/theme.js";
import IntroPage from "../components/intro-page.jsx";
import UserRegister from "../components/Security/UserRegister/UserRegister.jsx";
import VerifyPending from "../components/Security/VerifyPending.jsx";
import UserLogin from "../components/Security/UserLogin/UserLogin.jsx";
import UserProfile from "../components/Security/UserProfile/UserProfile.jsx";
import NotFoundPage from "../components/errors/404.jsx";
import  Home  from "../components/Common/Main/Home.jsx";
import { useStore } from "../context/Store.jsx";
import { GetCurrentUserAct } from "../actions/UserActions.js";
import { toast } from "react-hot-toast";
import { ProtectedRoute, GuestRoute } from "../guards/Guard.jsx";
import MatLoader from "../components/Common/Load/MatLoader.jsx";
import { useAuthWatchdog } from "../hooks/useAuthWatchdog.js";


export default function MainLayout() {
  useAuthWatchdog();
  const {dispatch } = useStore();
  const [startapp, setStartApp] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setStartApp(true);
        return;
      }

      try {
        const response = await GetCurrentUserAct();
        if (response.success) {
          dispatch({ type: "LOGIN", payload: response.data });
        } else {
          toast.error("Logueate para acceder a las funcionalidades y menu principal");
          localStorage.removeItem("token");
        }
      } catch (error) {
        toast.error("Error al obtener el Logueate para acceder a las funcionalidades y menu principal");
        localStorage.removeItem("token");
      } finally {
        setStartApp(true);
      }
    };

    if (!startapp) fetchUser();
  }, [startapp, dispatch]);

   if (!startapp) {
    return <MatLoader text="Cargando la experiencia PathFinderX..." />;
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", position: "relative", bgcolor: "background.default" }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundImage: `radial-gradient(circle 500px at 50% 300px, rgba(16,185,129,0.35), transparent)`,
          }}
        />
        <Box sx={{ position: "relative", zIndex: 10 }}>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { borderRadius: "8px", background: "#333", color: "#fff" },
            }}
          />
          <Switch>
            <Route path="/" component={() => <Redirect to="/intro" />} />
            <Route path="/intro" component={IntroPage} />

            <Route path="/register" component={() => <GuestRoute component={UserRegister} />} />
            <Route path="/login" component={() => <GuestRoute component={UserLogin} />} />
            <Route path="/verify-pending" component={() => <GuestRoute component={VerifyPending} />} />


            <Route path="/home" component={() => <ProtectedRoute component={Home} />} />
            <Route path="/profile" component={() => <ProtectedRoute component={UserProfile} />} />
            <Route component={NotFoundPage} />
          </Switch>
        </Box>
      </Box>
    </ThemeProvider>
  );
}