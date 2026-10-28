/** Admin landing page for opening college and exam management screens. */
import { Plus } from 'lucide-react';
import { useState } from 'react';

import CollegeForm from '@/components/admin/CollegeForm';
import CollegeTable from '@/components/admin/CollegeTable';
import { College } from '@/types';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [showCollegeForm, setShowCollegeForm] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [collegeRefreshKey, setCollegeRefreshKey] = useState(0);
  const navigate = useNavigate();

  const openAddCollege = () => {
    setEditingCollege(null);
    setShowCollegeForm(true);
  };

  const openEditCollege = (college: College) => {
    setEditingCollege(college);
    setShowCollegeForm(true);
  };

  const closeForm = () => {
    setEditingCollege(null);
    setShowCollegeForm(false);
  };
  return (
    <div className="space-y-6">
      {/* Heading */}

      <div>
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>

        <p className="text-neutral-400">Manage all PathForge AI data from here.</p>
      </div>

      {/* Cards */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-2 text-xl font-bold">Top Colleges</h2>

          <p className="mb-4 text-neutral-400">Add, Edit and Delete colleges.</p>

          <button onClick={openAddCollege} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add College
          </button>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="mb-2 text-xl font-bold">Government Exams</h2>

          <p className="mb-4 text-neutral-400">Add and manage government exams.</p>

          <button
            onClick={() => navigate('/admin/government-exams')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Manage Exams
          </button>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="mb-2 text-xl font-bold">Placement Exams</h2>

          <p className="mb-4 text-neutral-400">Manage placement exam information.</p>

          <button onClick={() => navigate('/admin/placement-exams')} className="btn-primary">
            Manage Placement Exams
          </button>
        </div>
      </div>

      {/* College Table */}

      <CollegeTable onEdit={openEditCollege} refreshKey={collegeRefreshKey} />

      {/* Popup */}

      {showCollegeForm && (
        <CollegeForm
          editingCollege={editingCollege}
          onCancel={closeForm}
          onSuccess={() => {
            closeForm();
            setCollegeRefreshKey((key) => key + 1);
          }}
        />
      )}
    </div>
  );
}
