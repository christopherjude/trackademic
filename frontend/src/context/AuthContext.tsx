import React, { createContext, useContext, useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";
import { createApiClient } from "../services/apiClient";

interface User {
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
    if (accounts.length > 0) {
      const account: AccountInfo = accounts[0];
      const fullName = account.name || "";
      const [firstName, ...rest] = fullName.split(" "); 
      const lastName = rest.join(" ");
      const email = account.username;

      // Create API client with MSAL integration
      const client = createApiClient(instance, account);
      setApiClient(client);

      // Get roles from ID token claims
      let role: "student" | "supervisor" | "director" = "student"; // default
      
      // Check if the account has ID token claims with roles
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

      console.log("User roles from token:", account.idTokenClaims?.roles);
      console.log("Assigned role:", role);

      setUser({
        firstName,
        lastName,
        email,
        avatarUrl: "/avatar.png",
        role,
      });
    } else {
      setUser(null);
      setApiClient(null);
    }
  }, [instance, accounts]);

  return (
    <AuthContext.Provider value={{ user, apiClient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
