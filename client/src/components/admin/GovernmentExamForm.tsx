/** Create or edit government-exam details from the admin interface. */
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { jsonToText, splitCommaSeparated } from '@/lib/utils';
import { GovernmentExam } from '@/pages/Admin/GovernmentExamAdmin';

type Props = {
  open: boolean;
  onClose: () => void;
  exam: GovernmentExam | null;
  onSuccess: () => void;
};

/** Parse the syllabus textarea back into a JSON value for the API. */
function parseSyllabus(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) return {};
  try {
    return JSON.parse(trimmed);
  } catch {
    // Not JSON — treat as one topic per line.
    const items = trimmed
      .split('\n')
      .map((line) => line.replace(/^[-*•]\s*/, '').trim())
      .filter(Boolean);
    return items.length ? items : {};
  }
}

export default function GovernmentExamForm({ open, onClose, exam, onSuccess }: Props) {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: '',
    whoShouldTake: '',
    eligibility: '',
    difficulty: '',
    pattern: '',
    schedule: '',
    syllabus: '',
    opportunities: '',
    officialUrl: '',
    tags: '',
  });

  useEffect(() => {
    if (exam) {
      setForm({
        name: exam.name,
        slug: exam.slug,
        category: exam.category,
        whoShouldTake: exam.whoShouldTake,
        eligibility: exam.eligibility,
        difficulty: exam.difficulty,
        pattern: jsonToText(exam.pattern),
        schedule: jsonToText(exam.schedule),
        syllabus: jsonToText(exam.syllabus),
        opportunities: exam.opportunities,
        officialUrl: exam.officialUrl,
        tags: exam.tags.join(', '),
      });
    } else {
      setForm({
        name: '',
        slug: '',
        category: '',
        whoShouldTake: '',
        eligibility: '',
        difficulty: '',
        pattern: '',
        schedule: '',
        syllabus: '',
        opportunities: '',
        officialUrl: '',
        tags: '',
      });
    }
  }, [exam]);

  async function handleSubmit() {
    const payload = {
      ...form,
      pattern: parseSyllabus(form.pattern),
      schedule: parseSyllabus(form.schedule),
      syllabus: parseSyllabus(form.syllabus),
      tags: splitCommaSeparated(form.tags),
    };

    try {
      if (exam) {
        await api.put(`/exams/government/${exam.slug}`, payload);
      } else {
        await api.post('/exams/government', payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl bg-neutral-900 p-8">
        <h2 className="text-2xl font-bold">{exam ? 'Edit Exam' : 'Add Government Exam'}</h2>

        <input
          placeholder="Exam Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-xl bg-neutral-800 p-3"
        />

        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="w-full rounded-xl bg-neutral-800 p-3"
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full rounded-xl bg-neutral-800 p-3"
        />

        <input
          placeholder="Who should take"
          value={form.whoShouldTake}
          onChange={(e) =>
            setForm({
              ...form,
              whoShouldTake: e.target.value,
            })
          }
          className="w-full rounded-xl bg-neutral-800 p-3"
        />

        <input
          placeholder="Eligibility"
          value={form.eligibility}
          onChange={(e) =>
            setForm({
              ...form,
              eligibility: e.target.value,
            })
          }
          className="w-full rounded-xl bg-neutral-800 p-3"
        />

        <input
          placeholder="Difficulty"
          value={form.difficulty}
          onChange={(e) =>
            setForm({
              ...form,
              difficulty: e.target.value,
            })
          }
          className="w-full rounded-xl bg-neutral-800 p-3"
        />

        <textarea
          placeholder='Exam pattern (JSON, e.g. {"stages":["Prelims","Mains"]})'
          value={form.pattern}
          onChange={(e) => setForm({ ...form, pattern: e.target.value })}
          rows={4}
          className="w-full rounded-xl bg-neutral-800 p-3 font-mono text-sm"
        />

        <textarea
          placeholder='Schedule and official dates (JSON; only add dates confirmed by the official source)'
          value={form.schedule}
          onChange={(e) => setForm({ ...form, schedule: e.target.value })}
          rows={4}
          className="w-full rounded-xl bg-neutral-800 p-3 font-mono text-sm"
        />

        <textarea
          placeholder='Syllabus — one topic per line, OR JSON object (e.g. {"CS":["DSA","OS"]})'
          value={form.syllabus}
          onChange={(e) =>
            setForm({
              ...form,
              syllabus: e.target.value,
            })
          }
          rows={6}
          className="w-full rounded-xl bg-neutral-800 p-3 font-mono text-sm"
        />

        <textarea
          placeholder="Opportunities (e.g. jobs, PSUs, higher education paths)"
          value={form.opportunities}
          onChange={(e) =>
            setForm({
              ...form,
              opportunities: e.target.value,
            })
          }
          rows={3}
          className="w-full rounded-xl bg-neutral-800 p-3"
        />

        <input
          placeholder="Official URL"
          value={form.officialUrl}
          onChange={(e) =>
            setForm({
              ...form,
              officialUrl: e.target.value,
            })
          }
          className="w-full rounded-xl bg-neutral-800 p-3"
        />

        <input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) =>
            setForm({
              ...form,
              tags: e.target.value,
            })
          }
          className="w-full rounded-xl bg-neutral-800 p-3"
        />

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="rounded-xl bg-neutral-700 px-5 py-2">
            Cancel
          </button>

          {/* Saves the validated exam form, then refreshes and closes the dialog. */}
          <button
            onClick={handleSubmit}
            className="rounded-xl bg-violet-600 px-5 py-2 hover:bg-violet-700"
          >
            {exam ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
