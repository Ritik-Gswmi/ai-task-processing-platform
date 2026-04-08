import { createContext, useState, useEffect } from "react";
import { getToken, removeToken } from "../utils/token";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const token = getToken();

    if (token) {
      setUser({ token });
    }

  }, []);

  const logout = () => {

    removeToken();
    setUser(null);

  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};