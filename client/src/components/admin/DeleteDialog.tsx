/** Confirms and deletes a government exam from the admin interface. */
import { api } from '@/lib/api';
import { GovernmentExam } from '@/pages/Admin/GovernmentExamAdmin';

type Props = {
  open: boolean;
  exam: GovernmentExam | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function DeleteDialog({ open, exam, onClose, onSuccess }: Props) {
  if (!open || !exam) return null;

  async function handleDelete() {
    try {
      if (!exam) return;
      await api.delete(`/exams/government/${exam.slug}`);

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to delete exam.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-neutral-900 p-8">
        <h2 className="mb-4 text-2xl font-bold">Delete Government Exam</h2>

        <p className="text-neutral-300">Are you sure you want to delete</p>

        <p className="mt-2 font-bold text-red-400">{exam.name}</p>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl bg-neutral-700 px-5 py-2">
            Cancel
          </button>

          {/* Deletes the selected exam and refreshes the admin list on success. */}
          <button
            onClick={handleDelete}
            className="rounded-xl bg-red-600 px-5 py-2 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
