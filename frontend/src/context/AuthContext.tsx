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
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: false,
  isInitializing: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userData = await apiClient.login(email, password) as User;
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
    const checkExistingSession = async () => {
      const savedUserId = localStorage.getItem('currentUserId');
      if (savedUserId) {
        try {
          const userData = await apiClient.getCurrentUser(parseInt(savedUserId)) as User;
          setUser(userData);
        } catch (error) {
          console.error('Failed to restore session:', error);
          // If fetching fails, clear the stored ID
          localStorage.removeItem('currentUserId');
        }
      }
      setIsInitializing(false);
    };

    checkExistingSession();
  }, []); // Empty dependency array - only run on mount

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
