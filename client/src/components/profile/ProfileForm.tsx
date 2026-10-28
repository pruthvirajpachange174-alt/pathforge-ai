/** Renders the Profile Form interface component. */
import TagInput from "./TagInput";

type UserProfile = {
  name: string;
  email: string;

  image?: string;
  college?: string;
  year?: number;
  branch?: string;

  careerGoal?: string;
  city?: string;

  skills: string[];
  languages: string[];
  interests: string[];

  githubUrl?: string;
  leetcodeUrl?: string;
  linkedinUrl?: string;

  bio?: string;
};

type Props = {
  form: UserProfile;
  setForm: React.Dispatch<React.SetStateAction<UserProfile>>;
};

export default function ProfileForm({
  form,
  setForm,
}: Props) {
  return (
    <div className="bg-neutral-900 rounded-2xl p-6 space-y-5">

      <div>
        <label className="font-semibold">Name</label>

        <input
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="w-full rounded-xl border border-neutral-700 bg-neutral-800 p-3"
        />
      </div>

      <div>
        <label className="font-semibold">Email</label>

        <input
          value={form.email}
          readOnly
          className="w-full rounded-xl border border-neutral-700 bg-neutral-700 p-3 opacity-70"
        />

        <p className="text-xs text-neutral-400 mt-1">
          Email is managed by Clerk.
        </p>
      </div>

      <div>
        <label className="font-semibold">College</label>

        <input
          value={form.college ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              college: e.target.value,
            })
          }
          className="w-full rounded-xl border border-neutral-700 bg-neutral-800 p-3"
        />
      </div>

      <div>
        <label className="font-semibold">Branch</label>

        <input
          value={form.branch ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              branch: e.target.value,
            })
          }
          className="w-full rounded-xl border border-neutral-700 bg-neutral-800 p-3"
        />
      </div>

      <div>
        <label className="font-semibold">Year</label>

        <select
          value={form.year ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              year: Number(e.target.value),
            })
          }
          className="w-full rounded-xl border border-neutral-700 bg-neutral-800 p-3"
        >
          <option value="">Select Year</option>
          <option value={1}>1st Year</option>
          <option value={2}>2nd Year</option>
          <option value={3}>3rd Year</option>
          <option value={4}>4th Year</option>
        </select>
      </div>

// interest,skill,languages box 
<TagInput
  label="Skills"
  values={form.skills}
  onChange={(skills) =>
    setForm({
      ...form,
      skills,
    })
  }
/>

<TagInput
  label="Languages"
  values={form.languages}
  onChange={(languages) =>
    setForm({
      ...form,
      languages,
    })
  }
/>

<TagInput
  label="Interests"
  values={form.interests}
  onChange={(interests) =>
    setForm({
      ...form,
      interests,
    })
  }
/>

      <div>
        <label className="font-semibold">Career Goal</label>

        <input
          value={form.careerGoal ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              careerGoal: e.target.value,
            })
          }
          className="w-full rounded-xl border border-neutral-700 bg-neutral-800 p-3"
        />
      </div>

      <div>
        <label className="font-semibold">City</label>

        <input
          value={form.city ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              city: e.target.value,
            })
          }
          className="w-full rounded-xl border border-neutral-700 bg-neutral-800 p-3"
        />
      </div>

      <div>
        <label className="font-semibold">GitHub</label>

        <input
          value={form.githubUrl ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              githubUrl: e.target.value,
            })
          }
          className="w-full rounded-xl border border-neutral-700 bg-neutral-800 p-3"
        />
      </div>

      <div>
        <label className="font-semibold">LeetCode</label>

        <input
          value={form.leetcodeUrl ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              leetcodeUrl: e.target.value,
            })
          }
          className="w-full rounded-xl border border-neutral-700 bg-neutral-800 p-3"
        />
      </div>

      <div>
        <label className="font-semibold">LinkedIn</label>

        <input
          value={form.linkedinUrl ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              linkedinUrl: e.target.value,
            })
          }
          className="w-full rounded-xl border border-neutral-700 bg-neutral-800 p-3"
        />
      </div>

      <div>
        <label className="font-semibold">Bio</label>

        <textarea
          rows={5}
          value={form.bio ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              bio: e.target.value,
            })
          }
          className="w-full rounded-xl border border-neutral-700 bg-neutral-800 p-3"
        />
      </div>

    </div>
  );
}