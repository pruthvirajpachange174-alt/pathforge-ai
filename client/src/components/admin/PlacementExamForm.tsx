/** Create or edit placement-exam details from the admin interface. */
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { jsonToText, splitCommaSeparated } from '@/lib/utils';
import { PlacementExam } from '@/pages/Admin/PlacementExamAdmin';

type Props = {
  exam: PlacementExam | null;
  onClose: () => void;
};

/** Parse a JSON textarea back into a JSON value for the API. */
function parseJSON(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) return {};
  try {
    return JSON.parse(trimmed);
  } catch {
    return {};
  }
}

export default function PlacementExamForm({ exam, onClose }: Props) {
  const [company, setCompany] = useState('');
  const [slug, setSlug] = useState('');
  const [logo, setLogo] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [topics, setTopics] = useState('');
  const [tags, setTags] = useState('');
  const [previousTrends, setPreviousTrends] = useState('');

  const [examPattern, setExamPattern] = useState('');
  const [roadmap, setRoadmap] = useState('');
  const [resources, setResources] = useState('');
  const [hiringProcess, setHiringProcess] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (exam) {
      setCompany(exam.company);
      setSlug(exam.slug);
      setLogo(exam.logo || '');
      setEligibility(exam.eligibility);
      setDifficulty(exam.difficulty);
      setExpectedSalary(exam.expectedSalary);
      setTopics(exam.topics.join(', '));
      setTags(exam.tags.join(', '));
      setPreviousTrends(exam.previousTrends);
      setExamPattern(jsonToText(exam.examPattern));
      setRoadmap(jsonToText(exam.roadmap));
      setResources(jsonToText(exam.resources));
      setHiringProcess(jsonToText(exam.hiringProcess));
    } else {
      setCompany('');
      setSlug('');
      setLogo('');
      setEligibility('');
      setDifficulty('Medium');
      setExpectedSalary('');
      setTopics('');
      setTags('');
      setPreviousTrends('');
      setExamPattern('');
      setRoadmap('');
      setResources('');
      setHiringProcess('');
    }
  }, [exam]);

  async function handleSubmit() {
    if (!company.trim()) {
      alert('Company is required.');
      return;
    }
    if (!slug.trim()) {
      alert('Slug is required.');
      return;
    }
    if (!eligibility.trim()) {
      alert('Eligibility is required.');
      return;
    }
    if (!expectedSalary.trim()) {
      alert('Expected Salary is required.');
      return;
    }

    let parsedExamPattern: unknown = {};
    let parsedRoadmap: unknown = {};
    let parsedResources: unknown = {};
    let parsedHiringProcess: unknown = {};

    try {
      parsedExamPattern = JSON.parse(examPattern || '{}');
    } catch {
      alert('Exam Pattern must be valid JSON.');
      return;
    }
    try {
      parsedRoadmap = JSON.parse(roadmap || '{}');
    } catch {
      alert('Roadmap must be valid JSON.');
      return;
    }
    try {
      parsedResources = JSON.parse(resources || '{}');
    } catch {
      alert('Resources must be valid JSON.');
      return;
    }
    try {
      parsedHiringProcess = JSON.parse(hiringProcess || '{}');
    } catch {
      alert('Hiring Process must be valid JSON.');
      return;
    }

    const payload = {
      company,
      slug,
      logo,
      eligibility,
      examPattern: parsedExamPattern,
      difficulty,
      topics: splitCommaSeparated(topics),
      roadmap: parsedRoadmap,
      previousTrends,
      resources: parsedResources,
      expectedSalary,
      hiringProcess: parsedHiringProcess,
      tags: splitCommaSeparated(tags),
    };

    setSaving(true);
    try {
      if (exam) {
        await api.put(`/admin/placement/${exam.slug}`, payload);
      } else {
        await api.post('/admin/placement', payload);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    'w-full p-3 rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-neutral-100';
  const textareaClass =
    'w-full p-3 rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-neutral-100 font-mono text-sm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl bg-neutral-900 p-8">
        <h2 className="text-2xl font-bold text-white">
          {exam ? 'Edit Placement Exam' : 'Add Placement Exam'}
        </h2>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-400">
            Company *
          </label>
          <input
            placeholder="e.g. TCS"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-400">
            Slug *
          </label>
          <input
            placeholder="e.g. tcs-nqt"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-400">
            Logo URL
          </label>
          <input
            placeholder="https://example.com/logo.png"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-400">
            Eligibility *
          </label>
          <textarea
            rows={3}
            placeholder="Eligibility criteria"
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-400">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className={inputClass}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-400">
            Expected Salary *
          </label>
          <input
            placeholder="e.g. ₹7-12 LPA"
            value={expectedSalary}
            onChange={(e) => setExpectedSalary(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-400">
            Topics (comma separated)
          </label>
          <input
            placeholder="e.g. DSA, Aptitude, SQL"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-400">
            Tags (comma separated)
          </label>
          <input
            placeholder="e.g. FAANG, high-paying"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-400">
            Previous Trends
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Coding questions medium difficulty; focus on OOP + SQL."
            value={previousTrends}
            onChange={(e) => setPreviousTrends(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-400">
            Exam Pattern (JSON)
          </label>
          <textarea
            rows={6}
            placeholder={
              '{"sections": ["Aptitude", "Coding"], "duration": "180 min", "mode": "Online"}'
            }
            value={examPattern}
            onChange={(e) => setExamPattern(e.target.value)}
            className={textareaClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-400">
            Roadmap (JSON)
          </label>
          <textarea
            rows={6}
            placeholder='{"week1": "Aptitude + Verbal", "week2": "Basic DSA"}'
            value={roadmap}
            onChange={(e) => setRoadmap(e.target.value)}
            className={textareaClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-400">
            Resources (JSON)
          </label>
          <textarea
            rows={6}
            placeholder='{"practice": ["LeetCode", "GFG"], "books": ["CLRS"]}'
            value={resources}
            onChange={(e) => setResources(e.target.value)}
            className={textareaClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-400">
            Hiring Process (JSON)
          </label>
          <textarea
            rows={6}
            placeholder='{"rounds": ["Online Assessment", "Technical Interview", "HR"]}'
            value={hiringProcess}
            onChange={(e) => setHiringProcess(e.target.value)}
            className={textareaClass}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-neutral-700 px-5 py-2 text-white hover:bg-neutral-600"
          >
            Cancel
          </button>
          {/* Runs validation, serializes structured fields, and saves the exam. */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-xl bg-violet-600 px-5 py-2 text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : exam ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
