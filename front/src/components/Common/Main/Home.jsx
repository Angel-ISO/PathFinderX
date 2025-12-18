import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Box, 
  CssBaseline, 
  IconButton, 
  useTheme, 
  useMediaQuery, 
  Drawer, 
  Paper,
  Toolbar,
  Typography,
  Fab
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  Close as CloseIcon, 
  Route as RouteIcon,
  List as ListIcon
} from "@mui/icons-material";
import { useStore } from "../../../context/Store.jsx";
import { useLocation } from "wouter";
import PathPlanner from "./Map/PathPlanner.jsx";
import PathControls from "./Map/PathControls.jsx";
import Header from "../Head/Header.jsx";
import RoutesPanel from "./Route/RoutesPanel.jsx"; 
import useMapPointer from "./Map/MapPointer.jsx";

const Home = () => {
  const { state, dispatch } = useStore();
  const { userSession } = state;
  const [, navigate] = useLocation();
  const theme = useTheme();

  const isMobileWidth = useMediaQuery("(max-width: 800px)", { noSsr: true });
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"), { noSsr: true });

  const [panelOpen, setPanelOpen] = useState(false); 
  const [activeDrawer, setActiveDrawer] = useState(null);

  const mapControls = useMapPointer();
  const {
    points,
    mode,
    setMode,
    handleMapClick,
    calculateRoute,
    resetPoints,
    removeStop,
    removeObstacle,
    currentRoute,
    isCalculating,
    canCalculateRoute,
    hasPoints,
    error,
    routeStats
  } = mapControls;

  

  const panelWidth = useMemo(() => {
    if (isMobileWidth) return "90%";
    if (isTablet) return "350px";
    return "400px";
  }, [isMobileWidth, isTablet]);

  const userConfig = useMemo(() => ({
    name: userSession.username || "Usuario",
    onProfile: () => navigate("/profile"),
    onLogout: () => {
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("token");
      navigate("/intro");
    }
  }), [userSession.username, navigate, dispatch]);

  const pathControlsProps = useMemo(() => ({
    points,
    mode,
    setMode,
    handleMapClick,
    calculateRoute,
    resetPoints,
    removeStop,
    removeObstacle,
    currentRoute,
    isCalculating,
    canCalculateRoute,
    hasPoints,
    error,
    routeStats,
  }), [points, mode, handleMapClick, calculateRoute, resetPoints, removeStop, removeObstacle, currentRoute, isCalculating, canCalculateRoute, hasPoints, error, routeStats]);

  const memoDrawPath = useMemo(() => state.currentDrawPath, [
    state.currentDrawPath?.totalDistance,
    state.currentDrawPath?.route?.length,
    state.currentDrawPath?.updatedAt
  ]);

  const togglePanel = useCallback(() => {
    if (isMobileWidth) {
      setActiveDrawer(prev => prev === 'routes' ? null : 'routes');
    } else {
      setPanelOpen(prev => !prev);
    }
  }, [isMobileWidth]);

  const handleDrawerOpen = useCallback((drawerType) => {
    setActiveDrawer(prev => prev === drawerType ? null : drawerType);
  }, []);

  const closeDrawer = useCallback(() => {
    setActiveDrawer(null);
  }, []);

  useEffect(() => {
    if (!userSession.authenticated) {
      navigate("/login");
    }
  }, [userSession.authenticated, navigate]);

  useEffect(() => {
    if (isMobileWidth) {
      setPanelOpen(false);
      setActiveDrawer(null);
    } else {
      setPanelOpen(true);
    }
  }, [isMobileWidth]);

  const mapContainerStyles = useMemo(() => ({
    flexGrow: 1,
    width: "100%",
    height: "100%",
    transition: theme.transitions.create(["margin-right"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: !isMobileWidth && panelOpen ? panelWidth : 0,
  }), [theme, isMobileWidth, panelOpen, panelWidth]);

  const sidebarStyles = useMemo(() => ({
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: panelOpen ? panelWidth : 0,
    bgcolor: theme.palette.background.paper,
    borderLeft: panelOpen ? `1px solid ${theme.palette.divider}` : "none",
    overflow: "hidden",
    transition: theme.transitions.create(["width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
  }), [panelOpen, panelWidth, theme]);

  const toggleButtonStyles = useMemo(() => ({
    position: "absolute",
    right: !isMobileWidth && panelOpen ? `calc(${panelWidth} + 8px)` : 16,
    top: 80,
    zIndex: 1050,
    bgcolor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: theme.shadows[4],
    width: 48,
    height: 48,
    transition: theme.transitions.create(["right", "background-color"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.short,
    }),
    "&:hover": {
      bgcolor: theme.palette.primary.dark,
      boxShadow: theme.shadows[6],
    },
  }), [theme, isMobileWidth, panelOpen, panelWidth]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <CssBaseline />

      <Header userConfig={userConfig} />

      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          position: "relative",
          overflow: "hidden",
          height: {
            xs: "calc(100vh - 56px)",
            sm: "calc(100vh - 64px)",
          },
          mt: {
            xs: "56px",
            sm: "64px",
          },
        }}
      >
        <Box sx={mapContainerStyles}>
          <PathPlanner pathControlsProps={pathControlsProps} currentDrawPath={state.currentDrawPath} />
        </Box>

        {!isMobileWidth && (
          <Paper elevation={3} sx={sidebarStyles}>
            {panelOpen && (
              <Box sx={{ height: "100%", overflow: "auto", p: 2 }}>
                <RoutesPanel currentDrawPath={memoDrawPath} />
              </Box>
            )}
          </Paper>
        )}

        {isMobileWidth && (
          <>
            <Drawer
              anchor="left"
              open={activeDrawer === 'controls'}
              onClose={closeDrawer}
              variant="temporary"
              ModalProps={{ keepMounted: true }}
              sx={{
                zIndex: 1300,
                "& .MuiDrawer-paper": {
                  width: panelWidth,
                  bgcolor: theme.palette.background.paper,
                  height: "100%",
                },
              }}
            >
              <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6">Controles de Ruta</Typography>
                <IconButton onClick={closeDrawer}>
                  <CloseIcon />
                </IconButton>
              </Toolbar>
              <Box sx={{ overflow: "auto", flex: 1 }}>
                <PathControls
                  mode={mode}
                  setMode={setMode}
                  points={points}
                  calculateRoute={calculateRoute}
                  resetPoints={resetPoints}
                  removeStop={removeStop}
                  removeObstacle={removeObstacle}
                  currentRoute={currentRoute}
                  isLoading={isCalculating}
                  canCalculateRoute={canCalculateRoute}
                  hasPoints={hasPoints}
                  error={error}
                  routeStats={routeStats}
                />
              </Box>
            </Drawer>

            <Drawer
              anchor="right"
              open={activeDrawer === 'routes'}
              onClose={closeDrawer}
              variant="temporary"
              ModalProps={{ keepMounted: true }}
              sx={{
                zIndex: 1300,
                "& .MuiDrawer-paper": {
                  width: panelWidth,
                  bgcolor: theme.palette.background.paper,
                  height: "100%",
                },
              }}
            >
              <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6">Mis Rutas</Typography>
                <IconButton onClick={closeDrawer}>
                  <CloseIcon />
                </IconButton>
              </Toolbar>
              <Box sx={{ overflow: "auto", p: 2 }}>
                {activeDrawer === 'routes' && <RoutesPanel currentDrawPath={memoDrawPath} />}
              </Box>
            </Drawer>

            <Fab
              color="primary"
              size="medium"
              onClick={() => handleDrawerOpen('controls')}
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                zIndex: 1100
              }}
            >
              <RouteIcon />
            </Fab>
            <Fab
              color="default"
              size="medium"
              onClick={() => handleDrawerOpen('routes')}
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                zIndex: 1100
              }}
            >
              <ListIcon />
            </Fab>
          </>
        )}

        {!isMobileWidth && (
          <IconButton onClick={togglePanel} sx={toggleButtonStyles}>
            {panelOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(Home);