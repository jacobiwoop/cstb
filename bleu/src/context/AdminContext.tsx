import React, { createContext, useContext, useState, useEffect } from 'react';
import { LocalDB } from '../utils/localDb';

interface AdminContextType {
  isLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => LocalDB.get('is_logged_in', false));

  const login = (password: string) => {
    if (password === '5ukun4') { // Mot de passe mis à jour
      setIsLoggedIn(true);
      LocalDB.save('is_logged_in', true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    LocalDB.logout();
  };

  return (
    <AdminContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
