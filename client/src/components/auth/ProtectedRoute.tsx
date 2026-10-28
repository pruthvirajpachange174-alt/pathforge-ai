/** Renders the Protected Route interface component. */
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

type ProtectedRouteProps = {
  children: JSX.Element;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();

  // Wait until Clerk finishes loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950 text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // User not signed in
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // User authenticated
  return children;
}