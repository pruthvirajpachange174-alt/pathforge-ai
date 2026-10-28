/** Create or edit a college record from the admin interface. */
import { useState } from 'react';
import { api } from '@/lib/api';
import { splitCommaSeparated } from '@/lib/utils';

type College = {
  id: string;
  name: string;
  city: string;
  image?: string;
  website?: string;
  ranking?: string;
  description?: string;
  courses?: string[];
  facilities?: string[];
};

type Props = {
  editingCollege?: College | null;
  onSuccess: () => void;
  onCancel: () => void;
};

type FormState = {
  name: string;
  city: string;
  image: string;
  website: string;
  ranking: string;
  description: string;
  courses: string;
  facilities: string;
};

export default function CollegeForm({ editingCollege, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState<FormState>({
    name: editingCollege?.name || '',
    city: editingCollege?.city || '',
    image: editingCollege?.image || '',
    website: editingCollege?.website || '',
    ranking: editingCollege?.ranking || '',
    description: editingCollege?.description || '',
    courses: editingCollege?.courses?.join(', ') || '',
    facilities: editingCollege?.facilities?.join(', ') || '',
  });

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  // Validate required fields, persist the form, then refresh the parent list.
  const submit = async () => {
    if (!form.name.trim() || !form.city.trim()) {
      alert('College Name and City are required.');
      return;
    }

    const payload = {
      ...form,
      courses: splitCommaSeparated(form.courses),
      facilities: splitCommaSeparated(form.facilities),
    };

    try {
      if (editingCollege) {
        await api.put(`/admin/colleges/${editingCollege.id}`, payload);

        alert('College updated successfully!');
      } else {
        await api.post('/admin/colleges', payload);

        alert('College added successfully!');
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="max-h-[90vh] w-[520px] overflow-y-auto rounded-2xl bg-neutral-900 p-6">
        <h2 className="mb-6 text-2xl font-bold text-white">
          {editingCollege ? 'Edit College' : 'Add College'}
        </h2>

        <div className="space-y-4">
          <input
            placeholder="College Name"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 p-3"
          />

          <input
            placeholder="City"
            value={form.city}
            onChange={(e) => updateField('city', e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 p-3"
          />

          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => updateField('image', e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 p-3"
          />

          <input
            placeholder="Official Website"
            value={form.website}
            onChange={(e) => updateField('website', e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 p-3"
          />

          <input
            placeholder="Ranking"
            value={form.ranking}
            onChange={(e) => updateField('ranking', e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 p-3"
          />

          <textarea
            rows={4}
            placeholder="Description"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 p-3"
          />

          <input
            placeholder="Courses (comma separated)"
            value={form.courses}
            onChange={(e) => updateField('courses', e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 p-3"
          />

          <input
            placeholder="Facilities (comma separated)"
            value={form.facilities}
            onChange={(e) => updateField('facilities', e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 p-3"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg bg-gray-700 px-5 py-2 hover:bg-gray-600">
            Cancel
          </button>

          {/* Validates the required fields and creates or updates the college. */}
          <button onClick={submit} className="rounded-lg bg-blue-600 px-5 py-2 hover:bg-blue-700">
            {editingCollege ? 'Update College' : 'Save College'}
          </button>
        </div>
      </div>
    </div>
  );
}
