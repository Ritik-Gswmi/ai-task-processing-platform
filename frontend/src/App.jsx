import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CurrentTasks from "./pages/CurrentTasks";
import AllTasks from "./pages/AllTasks";
import Account from "./pages/Account";
import Loader from "./components/Loader";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

function RouteTransitionLoader() {
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const previousPath = previousPathRef.current;
    const currentPath = location.pathname;
    previousPathRef.current = currentPath;

    const isDashboardRoute = (path) => path.startsWith("/dashboard");

    if (
      previousPath !== currentPath &&
      isDashboardRoute(previousPath) &&
      isDashboardRoute(currentPath)
    ) {
      const showTimer = setTimeout(() => setVisible(true), 0);
      const hideTimer = setTimeout(() => setVisible(false), 900);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }

    return undefined;
  }, [location.pathname]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <Loader />
    </div>
  );
}

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <RouteTransitionLoader />
      <Routes>
        {/* Root route: redirect based on login status */}
        <Route
          path="/"
          element={user?.token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        {/* Login route */}
        <Route
          path="/login"
          element={user?.token ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* Register route */}
        <Route
          path="/register"
          element={user?.token ? <Navigate to="/dashboard" /> : <Register />}
        />

        {/* Protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/current"
          element={
            <ProtectedRoute>
              <CurrentTasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/all"
          element={
            <ProtectedRoute>
              <AllTasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route: redirect to root */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
