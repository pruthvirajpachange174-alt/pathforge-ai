/** Renders the Profile Completion interface component. */
type UserProfile = {
  name: string;
  email: string;

  college?: string;
  branch?: string;
  year?: number;

  careerGoal?: string;
  city?: string;

  bio?: string;

  githubUrl?: string;
  linkedinUrl?: string;
  leetcodeUrl?: string;

  skills: string[];
  interests: string[];
  languages: string[];
};

type Props = {
  profile: UserProfile;
};

export default function ProfileCompletion({ profile }: Props) {
  const fields = [
    !!profile.name,
    !!profile.college,
    !!profile.branch,
    !!profile.year,
    !!profile.careerGoal,
    !!profile.city,
    !!profile.bio,
    !!profile.githubUrl,
    !!profile.linkedinUrl,
    profile.skills.length > 0,
    profile.languages.length > 0,
    profile.interests.length > 0,
  ];

  const completed = fields.filter(Boolean).length;
  const total = fields.length;

  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="rounded-2xl bg-neutral-900 p-6 border border-neutral-800">

      <h2 className="text-xl font-bold mb-4">
        Profile Completion
      </h2>

      <div className="w-full h-4 rounded-full bg-neutral-800 overflow-hidden">

        <div
          className="h-full bg-violet-600 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <p className="mt-3 text-sm text-neutral-400">
        {percentage}% completed
      </p>

    </div>
  );
}