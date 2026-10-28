/** Renders the College Details application page. */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";

type College = {
  id: string;
  name: string;
  city: string;
  image?: string | null;
  website?: string | null;
  ranking?: string | null;
  description?: string | null;
  courses: string[];
  facilities: string[];
};

export default function CollegeDetails() {
  const { id } = useParams();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get(`/colleges/${id}`)
      .then((response) => {
        if (active) setCollege(response.data.data);
      })
      .catch(() => {
        if (active) setError('Could not load this college. Please try again later.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  if (loading) return <h2 className="p-10 text-center">Loading college...</h2>;
  if (error || !college) return <p role="alert" className="p-10 text-center text-red-400">{error || 'College not found.'}</p>;

  const website = safeExternalUrl(college.website);
  const image = safeExternalUrl(college.image);

  return (
    <div className="mx-auto max-w-6xl p-8">
      {image ? <img src={image} alt="" className="h-96 w-full rounded-3xl object-cover" /> : null}
      <h1 className="mt-8 text-4xl font-bold">{college.name}</h1>
      <p className="mt-2 text-xl text-gray-400">{college.city}</p>
      {college.ranking ? <p className="mt-2 text-sm text-gray-400">{college.ranking}</p> : null}
      {college.description ? <p className="mt-6">{college.description}</p> : null}

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Courses and study areas</h2>
        <ul className="ml-6 list-disc">
          {college.courses?.map((course) => <li key={course}>{course}</li>)}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Facilities and student resources</h2>
        <ul className="ml-6 list-disc">
          {college.facilities?.map((facility) => <li key={facility}>{facility}</li>)}
        </ul>
      </div>

      {website ? (
        <a
          href={website}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-block rounded-xl bg-blue-600 px-6 py-3"
        >
          Visit official website
        </a>
      ) : null}
    </div>
  );
}

function safeExternalUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}