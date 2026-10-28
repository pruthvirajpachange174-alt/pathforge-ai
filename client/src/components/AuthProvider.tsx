/** Connects Clerk's session token to the shared API client. */
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { attachToken } from '@/lib/api';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    return attachToken(getToken);
  }, [getToken]);

  return <>{children}</>;
}
