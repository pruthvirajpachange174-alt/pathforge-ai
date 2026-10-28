/** Application entry point: mounts routing, authentication, and query state. */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import AuthProvider from './components/AuthProvider';

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkKey}
      afterSignOutUrl="/sign-in"
      signInForceRedirectUrl="/"
      signUpForceRedirectUrl="/"
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter future={{ v7_startTransition: true }}>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
