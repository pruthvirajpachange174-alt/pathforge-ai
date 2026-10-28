/** Defines the client-side routes and page composition. */
import { lazy, Suspense } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRoute from '@/components/auth/AdminRoute';
import { SignIn, SignUp } from '@clerk/clerk-react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Chat = lazy(() => import('@/pages/Chat'));
const PlacementExams = lazy(() => import('@/pages/PlacementExams'));
const Languages = lazy(() => import('@/pages/Languages'));
const Hackathons = lazy(() => import('@/pages/Hackathons'));
const Roadmaps = lazy(() => import('@/pages/Roadmaps'));
const Compare = lazy(() => import('@/pages/Compare'));
const GovernmentExams = lazy(() => import('@/pages/GovernmentExams'));
const TechCareers = lazy(() => import('@/pages/TechCareers'));
const TopColleges = lazy(() => import('./pages/TopColleges'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const CollegeDetails = lazy(() => import('./pages/CollegeDetails'));
const IndiaDirectory = lazy(() => import('@/pages/IndiaDirectory'));
const Profile = lazy(() => import('./pages/Profile'));
const GovernmentExamAdmin = lazy(() => import('@/pages/Admin/GovernmentExamAdmin'));
const PlacementExamAdmin = lazy(() => import('./pages/Admin/PlacementExamAdmin'));

export default function App() {
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="flex min-h-48 items-center justify-center text-sm text-neutral-400">
            Loading page...
          </div>
        }
      >
        <Routes>
          {/* Authentication */}
          <Route
            path="/sign-in/*"
            element={
              <div className="flex min-h-screen items-center justify-center bg-neutral-950">
                <SignIn routing="path" path="/sign-in" />
              </div>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <div className="flex min-h-screen items-center justify-center bg-neutral-950">
                <SignUp routing="path" path="/sign-up" />
              </div>
            }
          />
          <Route path="/" element={<Navigate to="/government" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Profile Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/placements"
            element={<PlacementExams />}
          />
          <Route
            path="/government"
            element={<GovernmentExams />}
          />
          <Route
            path="/tech"
            element={<TechCareers />}
          />
          <Route
            path="/languages"
            element={<Languages />}
          />
          <Route
            path="/hackathons"
            element={<Hackathons />}
          />
          <Route
            path="/roadmaps"
            element={
              <ProtectedRoute>
                <Roadmaps />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compare"
            element={<Compare />}
          />
          <Route
            path="/colleges"
            element={<TopColleges />}
          />
          <Route
            path="/colleges/:id"
            element={<CollegeDetails />}
          />
          <Route
            path="/directory"
            element={<IndiaDirectory />}
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/placement-exams"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <PlacementExamAdmin />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/government-exams"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <GovernmentExamAdmin />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
}
