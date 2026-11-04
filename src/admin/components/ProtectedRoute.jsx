import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { useReducedMotion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import AdminSplash from "./AdminSplash";

const BOOTED_KEY = "tts:admin-booted";
const FIRST_BOOT_MS = 1300;

const bootedThisSession = () => {
  try {
    return sessionStorage.getItem(BOOTED_KEY) === "1";
  } catch {
    return false;
  }
};

// The boot screen shows for as long as the session check takes. On the first
// visit of a browser session it also stays long enough to finish its sequence;
// after that the console opens as fast as the check allows.
function useBootScreen(loading, isAuthenticated) {
  const reduce = useReducedMotion();
  const [minDone, setMinDone] = useState(() => reduce || bootedThisSession());

  useEffect(() => {
    if (minDone) return;
    const id = setTimeout(() => setMinDone(true), FIRST_BOOT_MS);
    return () => clearTimeout(id);
  }, [minDone]);

  useEffect(() => {
    if (!loading && isAuthenticated && minDone) {
      try {
        sessionStorage.setItem(BOOTED_KEY, "1");
      } catch {
        /* private mode: the boot screen just plays again */
      }
    }
  }, [loading, isAuthenticated, minDone]);

  // Signed-out visitors go straight to the login page, no ceremony.
  return loading || (isAuthenticated && !minDone);
}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, ensureSession } = useAuth();
  const location = useLocation();
  useEffect(ensureSession, [ensureSession]);
  const booting = useBootScreen(loading, isAuthenticated);

  if (booting) return <AdminSplash ready={!loading} />;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
