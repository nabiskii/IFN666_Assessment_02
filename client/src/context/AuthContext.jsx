import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('jwt'));
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.user_id);
        setIsAdmin(payload.is_admin || false);
        setIsAuthenticated(true);
      } catch {
        logout();
      }
    } else {
      setUserId(null);
      setIsAdmin(false);
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('jwt', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, isAdmin, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
