import { Configuration, PopupRequest } from "@azure/msal-browser";

// MSAL configuration
export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "f3c9699a-4b52-414f-b92c-a4922f8304f5",
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || "77040219-1098-4565-850f-f21d083689bb"}`,
    redirectUri: window.location.origin + "/dashboard",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

// Scopes for login - use User.Read for login, API scope for backend calls
export const loginRequest: PopupRequest = {
  scopes: ["User.Read"],
};

// API configuration
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
};

// Graph configuration
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
