import { Navigate } from 'react-router-dom';
import { useAdminStatus } from '@/hooks/useAdminStatus';

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const { status, retry } = useAdminStatus();

  if (status === 'loading') {
    return (
      <div className="flex min-h-48 items-center justify-center text-sm text-neutral-400">
        Checking administrator access...
      </div>
    );
  }

  if (status === 'user') return <Navigate to="/government" replace />;

  if (status === 'error') {
    return (
      <div role="alert" className="space-y-3 rounded-xl border border-red-500/20 p-5 text-sm text-red-300">
        <p>Administrator access could not be verified. Please try again.</p>
        <button type="button" onClick={retry} className="btn-primary">Retry</button>
      </div>
    );
  }

  return children;
}
