import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import Chat from '@/pages/Chat';
import PlacementExams from '@/pages/PlacementExams';
import Languages from '@/pages/Languages';
import Hackathons from '@/pages/Hackathons';
import Roadmaps from '@/pages/Roadmaps';
import Compare from '@/pages/Compare';

export default function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/placements" element={<PlacementExams />} />
        <Route path="/government" element={<div className="text-neutral-400">Government Exams — implement similarly to /placements using /exams/government</div>} />
        <Route path="/tech" element={<div className="text-neutral-400">Tech Careers — implement similarly using /tech</div>} />
        <Route path="/languages" element={<Languages />} />
        <Route path="/hackathons" element={<Hackathons />} />
        <Route path="/roadmaps" element={<Roadmaps />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </DashboardLayout>
  );
}