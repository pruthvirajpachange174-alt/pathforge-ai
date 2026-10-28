/** Displays government exams and exposes edit/delete actions for each row. */
import { GovernmentExam } from '@/pages/Admin/GovernmentExamAdmin';

type Props = {
  exams: GovernmentExam[];
  loading: boolean;

  onEdit: (exam: GovernmentExam) => void;
  onDelete: (exam: GovernmentExam) => void;
};

export default function GovernmentExamTable({ exams, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return <div className="py-10 text-center text-neutral-400">Loading...</div>;
  }

  if (exams.length === 0) {
    return <div className="py-10 text-center text-neutral-400">No Government Exams Found</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-800">
      <table className="w-full">
        <thead className="bg-neutral-900">
          <tr>
            <th className="p-4 text-left">Exam</th>

            <th className="p-4 text-left">Category</th>

            <th className="p-4 text-left">Difficulty</th>

            <th className="p-4 text-left">Eligibility</th>

            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id} className="border-t border-neutral-800 hover:bg-neutral-900/50">
              <td className="p-4">
                <div className="font-semibold">{exam.name}</div>

                <div className="text-xs text-neutral-500">{exam.slug}</div>
              </td>

              <td className="p-4">{exam.category}</td>

              <td className="p-4">{exam.difficulty}</td>

              <td className="p-4">{exam.eligibility}</td>

              <td className="p-4">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(exam)}
                    className="rounded-lg bg-blue-600 px-3 py-1 hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(exam)}
                    className="rounded-lg bg-red-600 px-3 py-1 hover:bg-red-700"
                  >
                    Delete
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
