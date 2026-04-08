import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
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

        {/* Catch-all route: redirect to root */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;