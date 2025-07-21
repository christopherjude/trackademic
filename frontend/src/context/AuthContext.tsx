import React, { createContext, useContext, useState } from "react";
import apiClient from "../services/apiClient";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: "student" | "supervisor" | "director";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userData = await apiClient.login(email, password);
      setUser(userData);
      
      // Store user ID in localStorage for simple session management
      localStorage.setItem('currentUserId', userData.id.toString());
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUserId');
  };

  // Check for existing session on mount
  React.useEffect(() => {
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId && !user) {
      // Optionally fetch user data from backend
      apiClient.getCurrentUser(parseInt(savedUserId))
        .then((userData: User) => setUser(userData))
        .catch(() => {
          // If fetching fails, clear the stored ID
          localStorage.removeItem('currentUserId');
        });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
