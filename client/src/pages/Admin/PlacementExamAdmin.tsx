/** Lists placement exams and coordinates their create, edit, and delete dialogs. */
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

import PlacementExamTable from '@/components/admin/PlacementExamTable';
import PlacementExamForm from '@/components/admin/PlacementExamForm';
import DeletePlacementDialog from '@/components/admin/DeletePlacementDialog';

export type PlacementExam = {
  id: string;
  company: string;
  slug: string;
  logo?: string;
  eligibility: string;
  examPattern: any;
  difficulty: string;
  topics: string[];
  roadmap: any;
  previousTrends: string;
  resources: any;
  expectedSalary: string;
  hiringProcess: any;
  tags: string[];
};

export default function PlacementExamAdmin() {
  const [loading, setLoading] = useState(true);

  const [placementExams, setPlacementExams] = useState<PlacementExam[]>([]);

  const [showForm, setShowForm] = useState(false);

  const [editingExam, setEditingExam] = useState<PlacementExam | null>(null);

  const [deleteExam, setDeleteExam] = useState<PlacementExam | null>(null);

  async function fetchPlacementExams() {
    try {
      const res = await api.get('/admin/placement');

      setPlacementExams(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlacementExams();
  }, []);

  function handleAdd() {
    setEditingExam(null);
    setShowForm(true);
  }

  function handleEdit(exam: PlacementExam) {
    setEditingExam(exam);
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Placement Exams</h1>

        <button onClick={handleAdd} className="btn-primary">
          + Add Placement Exam
        </button>
      </div>

      <PlacementExamTable
        loading={loading}
        exams={placementExams}
        onEdit={handleEdit}
        onDelete={setDeleteExam}
      />

      {showForm && (
        <PlacementExamForm
          exam={editingExam}
          onClose={() => {
            setShowForm(false);
            fetchPlacementExams();
          }}
        />
      )}

      {deleteExam && (
        <DeletePlacementDialog
          exam={deleteExam}
          onClose={() => {
            setDeleteExam(null);
            fetchPlacementExams();
          }}
        />
      )}
    </div>
  );
}
