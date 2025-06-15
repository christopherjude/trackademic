import React, { createContext, useContext, useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "supervisor" | "director";
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { accounts } = useMsal();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (accounts.length > 0) {
      const account: AccountInfo = accounts[0];
      const fullName = account.name || "";
      const [firstName, ...rest] = fullName.split(" "); 
      const lastName = rest.join(" ");
      const email = account.username;

      const derivedRole = email.includes("s") ? "student" : "supervisor"; // or fetch from DB

      setUser({
        firstName,
        lastName,
        email,
        avatarUrl: "/avatar.png", // optional
        role: derivedRole,
      });
    }
  }, [accounts]);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
