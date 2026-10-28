/** Renders the Top Colleges application page. */
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Search,
  GraduationCap,
  MapPin,
  BookOpen,
  Building2,
  Globe,
  PencilRuler,
} from "lucide-react";

import { Link } from "react-router-dom";

type College = {
  id: string;
  name: string;
  city: string;
};

export default function TopColleges() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/colleges")
      .then((response) => {
        if (active) setColleges(response.data.data);
      })
      .catch(() => {
        if (active) setError("Could not load colleges. Please try again later.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filtered = colleges.filter(
    (college) =>
      college.name.toLowerCase().includes(search.toLowerCase()) ||
      college.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="relative min-h-screen p-8 rounded-3xl overflow-hidden"
      style={{
        background: "#C6C5A6",
      }}
    >
      {/* Decorative Background Icons */}

<GraduationCap
  className="absolute top-10 left-10 opacity-10"
  size={90}
  color="black"
/>

<BookOpen
  className="absolute top-20 right-16 opacity-10"
  size={75}
  color="black"
/>

<Building2
  className="absolute bottom-20 left-16 opacity-10"
  size={90}
  color="black"
/>

<Globe
  className="absolute bottom-16 right-20 opacity-10"
  size={85}
  color="black"
/>

<PencilRuler
  className="absolute top-1/2 right-6 opacity-10"
  size={65}
  color="black"
/>

{/* Heading */}

<div className="flex justify-center mb-12">

  <div
    className="rounded-[30px] px-12 py-8 shadow-xl text-center max-w-3xl w-full"
    style={{
      background: "#F8F7F2", // Soft Off-White Capsule
    }}
  >

    <div className="flex justify-center mb-3">

      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{
          background: "#4C9162",
        }}
      >
        <GraduationCap
          size={34}
          color="white"
        />
      </div>

    </div>

    <h1
      className="text-5xl font-extrabold"
      style={{
        color: "#2F4F3E",
      }}
    >
      Top Colleges
    </h1>

    <p
      className="mt-4 text-lg"
      style={{
        color: "#6B6B58",
      }}
    >
      Explore India's leading engineering colleges, compare institutions,
      and discover detailed information to make informed career decisions.
    </p>

  </div>

</div>

      {/* Search */}

      <div className="relative max-w-md mb-10">
        <Search
          className="absolute left-3 top-3"
          size={18}
          color="#2F4F3E"
        />

        <input
          placeholder="Search college..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl px-10 py-3 outline-none shadow-md"
          style={{
            background: "#F7F6ED",
            color: "#2F4F3E",
          }}
        />
      </div>

      {loading && <p className="mb-6 text-sm text-neutral-700">Loading colleges...</p>}
      {error && <p role="alert" className="mb-6 text-sm text-red-700">{error}</p>}

      {/* Cards */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filtered.map((college) => (
          <div
            key={college.id}
            className="rounded-3xl p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            style={{
              background: "#4C9162",
            }}
          >
            <div className="flex justify-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: "#F7F6ED",
                }}
              >
                <GraduationCap
                  size={38}
                  color="#4C9162"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-white mt-6">
              {college.name}
            </h2>

            <div className="flex justify-center items-center gap-2 mt-3 text-green-100">
              <MapPin size={16} />
              {college.city}
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                to={`/colleges/${college.id}`}
                className="px-6 py-3 rounded-xl font-semibold transition hover:scale-105"
                style={{
                  background: "#F7F6ED",
                  color: "#2F4F3E",
                }}
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && filtered.length === 0 && (
        <div
          className="text-center text-xl py-14"
          style={{
            color: "#2F4F3E",
          }}
        >
          No colleges found.
        </div>
      )}
    </div>
  );
}