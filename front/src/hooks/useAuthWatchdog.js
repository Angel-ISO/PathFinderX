import { useEffect } from "react";
import { jwtDecode } from "jwt-decode"
import { useLocation } from "wouter";
import { useStore } from "../context/Store.jsx";

export function useAuthWatchdog() {
  const { dispatch } = useStore();
  const [, navigate] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    navigate("/intro");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { exp } = jwtDecode(token);
        if (exp < Date.now() / 1000) {
          handleLogout();
        }
      } catch {
        handleLogout();
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { exp } = jwtDecode(token);
          if (exp < Date.now() / 1000) {
            handleLogout();
          }
        } catch {
          handleLogout();
        }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storageListener = (event) => {
      if (event.key === "token" && !event.newValue) {
        handleLogout();
      }
    };
    window.addEventListener("storage", storageListener);
    return () => window.removeEventListener("storage", storageListener);
  }, []);
}