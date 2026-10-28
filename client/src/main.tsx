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

const root = ReactDOM.createRoot(document.getElementById('root')!);

if (!clerkKey) {
  // Without a key ClerkProvider throws and the page renders blank; show why instead.
  root.render(
    <div style={{ padding: 32, color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>Configuration missing</h1>
      <p>Set CLERK_PUBLISHABLE_KEY (or VITE_CLERK_PUBLISHABLE_KEY) and redeploy.</p>
    </div>,
  );
} else root.render(
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
