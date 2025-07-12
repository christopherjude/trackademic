import React, { createContext, useContext, useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";
import { createApiClient } from "../services/apiClient";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "supervisor" | "director";
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  apiClient: any;
}

const AuthContext = createContext<AuthContextType>({ user: null, apiClient: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { instance, accounts } = useMsal();
  const [user, setUser] = useState<User | null>(null);
  const [apiClient, setApiClient] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (accounts.length > 0) {
        const account: AccountInfo = accounts[0];
        
        // Create API client with MSAL integration
        const client = createApiClient(instance, account);
        setApiClient(client);

        try {
          // Fetch full user data from backend
          const userData = await client.getCurrentUser() as {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            role: "student" | "supervisor" | "director";
          };
          
          setUser({
            id: userData.id,
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
            role: userData.role,
            avatarUrl: "/avatar.png",
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // Fallback to Azure AD token data if API call fails
          const fullName = account.name || "";
          const [firstName, ...rest] = fullName.split(" "); 
          const lastName = rest.join(" ");
          const email = account.username;

          // Get roles from ID token claims
          let role: "student" | "supervisor" | "director" = "student"; // default
          
          if (account.idTokenClaims && account.idTokenClaims.roles) {
            const roles = account.idTokenClaims.roles as string[];
            
            if (roles.includes("Director")) {
              role = "director";
            } else if (roles.includes("Supervisor")) {
              role = "supervisor";
            } else if (roles.includes("Student")) {
              role = "student";
            }
          }

          // Debug: Log user info and token claims
          console.log("[AuthContext] Signed-in user:", {
            name: fullName,
            email,
            role,
            idTokenClaims: account.idTokenClaims
          });

          setUser({
            id: 0, // Fallback ID when backend is unavailable
            firstName,
            lastName,
            email,
            avatarUrl: "/avatar.png",
            role,
          });
        }
      } else {
        setUser(null);
        setApiClient(null);
      }
    };

    fetchUserData();
  }, [instance, accounts]);

  return (
    <AuthContext.Provider value={{ user, apiClient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
