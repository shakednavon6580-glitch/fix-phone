import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  userId: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from sessionStorage on mount
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    const storedUsername = sessionStorage.getItem('username');
    const storedRole = sessionStorage.getItem('role');

    if (storedUserId && storedUsername && storedRole) {
      setUser({
        userId: storedUserId,
        username: storedUsername,
        role: storedRole,
      });
    }
  }, []);

  const login = (userData: User) => {
    // Store in sessionStorage
    sessionStorage.setItem('userId', userData.userId);
    sessionStorage.setItem('username', userData.username);
    sessionStorage.setItem('role', userData.role);
    
    // Update state
    setUser(userData);
  };

  const logout = () => {
    // Clear sessionStorage
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('role');
    
    // Clear state
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
