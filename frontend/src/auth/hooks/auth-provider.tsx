import { 
  PublicClientApplication, 
  EventType, 
  AuthenticationResult 
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "../auth-config";
import { ReactNode, useEffect, useState } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [msalInstance] = useState(
    () => new PublicClientApplication(msalConfig)
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      // 1️⃣ initialize MSAL
      await msalInstance.initialize();

      // 2️⃣ handle redirect response (login or silent renew)
      const redirectResult = await msalInstance.handleRedirectPromise();
      console.log('[MSAL] handleRedirectPromise result:', redirectResult);
      if (redirectResult?.account) {
        msalInstance.setActiveAccount(redirectResult.account);
      }

      // 3️⃣ fallback to a cached account
      const accounts = msalInstance.getAllAccounts();
      if (!msalInstance.getActiveAccount() && accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
      }

      // 4️⃣ keep active account in sync on LOGIN_SUCCESS
      msalInstance.enableAccountStorageEvents();
      msalInstance.addEventCallback((event) => {
        if (
          event.eventType === EventType.LOGIN_SUCCESS &&
          (event.payload as AuthenticationResult)?.account
        ) {
          msalInstance.setActiveAccount(
            (event.payload as AuthenticationResult).account
          );
        }
      });

      setReady(true);
    })();
  }, [msalInstance]);

  if (!ready) {
    return <div>Loading authentication…</div>;
  }

  // only render your app once MSAL is ready
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};
