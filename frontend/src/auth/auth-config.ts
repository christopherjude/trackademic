import { PopupRequest } from "@azure/msal-browser";

// MSAL configuration
export const msalConfig = {
  auth: {
    clientId: "f3c9699a-4b52-414f-b92c-a4922f8304f5",
    authority: "https://login.microsoftonline.com/77040219-1098-4565-850f-f21d083689bb",
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin + "/dashboard",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

// Scopes for login
export const loginRequest: PopupRequest = {
  scopes: ["User.Read"],
};

// API configuration for local backend
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
};

// Graph configuration
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
