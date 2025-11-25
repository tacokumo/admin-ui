/// <reference types="vite/client" />

// Runtime environment configuration
interface RuntimeEnv {
  VITE_AUTH0_DOMAIN: string;
  VITE_AUTH0_CLIENT_ID: string;
  VITE_AUTH0_AUDIENCE: string;
  VITE_API_BASE_URL: string;
}

declare global {
  interface Window {
    ENV?: RuntimeEnv;
  }
}

export {};
