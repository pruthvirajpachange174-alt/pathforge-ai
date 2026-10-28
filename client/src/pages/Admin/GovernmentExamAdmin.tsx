/** Lists government exams and coordinates their create, edit, and delete dialogs. */
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import GovernmentExamTable from '@/components/admin/GovernmentExamTable';
import GovernmentExamForm from '@/components/admin/GovernmentExamForm';
import DeleteDialog from '@/components/admin/DeleteDialog';

export type GovernmentExam = {
  id: string;
  name: string;
  slug: string;
  category: string;
  whoShouldTake: string;
  eligibility: string;
  pattern: unknown;
  schedule: unknown;
  syllabus: unknown;
  difficulty: string;
  opportunities: string;
  officialUrl: string;
  tags: string[];
};

export default function GovernmentExamAdmin() {
  const [exams, setExams] = useState<GovernmentExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<GovernmentExam | null>(null);
  const [deletingExam, setDeletingExam] = useState<GovernmentExam | null>(null);

  async function fetchExams() {
    setLoading(true);
    try {
      const res = await api.get('/exams/government');
      setExams(res.data.data);
    } catch (err) {
      console.error('Failed to fetch exams', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExams();
  }, []);

  function handleAdd() {
    setEditingExam(null);
    setShowForm(true);
  }

  function handleEdit(exam: GovernmentExam) {
    setEditingExam(exam);
    setShowForm(true);
  }

  function handleDelete(exam: GovernmentExam) {
    setDeletingExam(exam);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingExam(null);
    fetchExams();
  }

  function handleDeleteSuccess() {
    setDeletingExam(null);
    fetchExams();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Government Exams</h1>
          <p className="text-neutral-400">Manage all government exam entries.</p>
        </div>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 hover:bg-violet-700"
        >
          + Add Exam
        </button>
      </div>

      <GovernmentExamTable
        exams={exams}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <GovernmentExamForm
        open={showForm}
        onClose={() => setShowForm(false)}
        exam={editingExam}
        onSuccess={handleFormSuccess}
      />

      <DeleteDialog
        open={!!deletingExam}
        exam={deletingExam}
        onClose={() => setDeletingExam(null)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
