import { createContext, useContext, useState } from "react";
import { clearCurrentTask, removeToken } from "../utils/token";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ token: localStorage.getItem("token") });

  // logout function
  const logout = (navigate) => {
    removeToken();      // remove JWT from localStorage
    clearCurrentTask();
    setUser(null);      // clear context
    if (navigate) navigate("/login"); // redirect
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
