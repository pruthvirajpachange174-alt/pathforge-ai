/** Loads and displays college records with edit and delete actions. */
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Pencil, Trash2, MapPin, GraduationCap } from 'lucide-react';
import { College } from '@/types';

type Props = {
  onEdit: (college: College) => void;
  refreshKey: number;
};

export default function CollegeTable({ onEdit, refreshKey }: Props) {
  const [colleges, setColleges] = useState<College[]>([]);

  const loadColleges = useCallback(async () => {
    const res = await api.get('/admin/colleges');
    setColleges(res.data.data);
  }, []);

  useEffect(() => {
    void loadColleges();
  }, [loadColleges, refreshKey]);

  const deleteCollege = async (id: string) => {
    if (!confirm('Delete this college?')) return;

    await api.delete(`/admin/colleges/${id}`);
    loadColleges();
  };

  return (
    <div className="mt-8">
      <h2 className="mb-5 text-2xl font-bold">Colleges List</h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {colleges.map((college) => (
          <div
            key={college.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg"
          >
            <div className="mb-4 flex items-center gap-3">
              <GraduationCap size={28} className="text-cyan-400" />

              <div>
                <h3 className="text-lg font-bold">{college.name}</h3>

                <div className="flex items-center gap-1 text-sm text-gray-300">
                  <MapPin size={14} />

                  {college.city}
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => onEdit(college)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-500 py-2 font-semibold text-black hover:bg-yellow-600"
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                onClick={() => deleteCollege(college.id)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2 font-semibold text-white hover:bg-red-700"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
