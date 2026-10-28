import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { api } from '@/lib/api';

type AdminStatus = 'loading' | 'admin' | 'user' | 'error';

export function useAdminStatus() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [status, setStatus] = useState<AdminStatus>('loading');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;

    if (!isLoaded) {
      setStatus('loading');
      return () => { active = false; };
    }

    if (!isSignedIn) {
      setStatus('user');
      return () => { active = false; };
    }

    setStatus('loading');
    getToken()
      .then((token) => {
        if (!token) throw new Error('No authenticated session token is available');
        return api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      })
      .then((response) => {
        if (!active) return;
        setStatus(response.data.data?.role === 'admin' ? 'admin' : 'user');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => { active = false; };
  }, [getToken, isLoaded, isSignedIn, retryKey]);

  return {
    status,
    retry: () => setRetryKey((current) => current + 1),
  };
}
