'use client';
import { createContext, useState, ReactNode } from 'react';
import { useEffect } from 'react';
export type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};
const AuthContext = createContext<AuthContextType | null>(null);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const flag = localStorage.getItem('token') ? true : false;
    setIsLoggedIn(flag);
  }, []);
  const login = () => {
    setIsLoggedIn(true);
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export { AuthContextProvider };
