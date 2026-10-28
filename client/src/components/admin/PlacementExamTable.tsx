/** Displays placement exams and exposes edit/delete actions for each row. */
import { Pencil, Trash2 } from 'lucide-react';
import { PlacementExam } from '@/pages/Admin/PlacementExamAdmin';

type Props = {
  loading: boolean;
  exams: PlacementExam[];

  onEdit: (exam: PlacementExam) => void;
  onDelete: (exam: PlacementExam) => void;
};

export default function PlacementExamTable({ loading, exams, onEdit, onDelete }: Props) {
  if (loading) {
    return <div className="glass rounded-2xl p-8 text-center">Loading Placement Exams...</div>;
  }

  if (exams.length === 0) {
    return <div className="glass rounded-2xl p-8 text-center">No Placement Exams Found</div>;
  }

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <table className="w-full">
        <thead className="bg-neutral-800">
          <tr>
            <th className="p-4 text-left">Company</th>

            <th className="p-4 text-left">Difficulty</th>

            <th className="p-4 text-left">Expected Salary</th>

            <th className="p-4 text-left">Tags</th>

            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id} className="border-t border-neutral-800">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  {exam.logo && (
                    <img
                      src={exam.logo}
                      alt={exam.company}
                      className="h-10 w-10 rounded-lg bg-white object-contain"
                    />
                  )}

                  <span className="font-medium">{exam.company}</span>
                </div>
              </td>

              <td className="p-4">{exam.difficulty}</td>

              <td className="p-4">{exam.expectedSalary}</td>

              <td className="p-4">
                <div className="flex flex-wrap gap-2">
                  {exam.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>

              <td className="p-4">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(exam)}
                    className="text-yellow-400 hover:text-yellow-300"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(exam)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
