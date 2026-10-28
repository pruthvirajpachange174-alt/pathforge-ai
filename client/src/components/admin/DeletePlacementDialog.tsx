/** Confirms and deletes a placement exam from the admin interface. */
import { api } from '@/lib/api';
import { PlacementExam } from '@/pages/Admin/PlacementExamAdmin';

type Props = {
  exam: PlacementExam;
  onClose: () => void;
};

export default function DeletePlacementDialog({ exam, onClose }: Props) {
  async function handleDelete() {
    try {
      await api.delete(`/admin/placement/${exam.slug}`);

      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to delete placement exam.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="glass w-full max-w-md rounded-2xl p-8">
        <h2 className="mb-4 text-2xl font-bold text-red-400">Delete Placement Exam</h2>

        <p className="mb-8 text-neutral-300">
          Are you sure you want to delete
          <span className="font-bold text-white"> {exam.company}</span>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl bg-neutral-700 px-5 py-2 transition hover:bg-neutral-600"
          >
            Cancel
          </button>

          {/* Deletes the selected exam before closing and refreshing the list. */}
          <button
            onClick={handleDelete}
            className="rounded-xl bg-red-600 px-5 py-2 transition hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
