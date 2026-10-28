/** Renders the Profile View interface component. */
type UserProfile = {
  name: string;
  email: string;
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
  profile: UserProfile;
};

export default function ProfileView({ profile }: Props) {
  return (
    <div className="bg-neutral-900 rounded-2xl p-6 space-y-4">

      <p><b>Name:</b> {profile.name}</p>

      <p><b>Email:</b> {profile.email}</p>

      <p><b>College:</b> {profile.college}</p>

      <p><b>Branch:</b> {profile.branch}</p>

      <p><b>Year:</b> {profile.year}</p>

      <p><b>Career Goal:</b> {profile.careerGoal}</p>

      <p><b>City:</b> {profile.city}</p>

      <p><b>Skills:</b> {profile.skills?.join(", ")}</p>

      <p><b>Languages:</b> {profile.languages?.join(", ")}</p>

      <p><b>Interests:</b> {profile.interests?.join(", ")}</p>

      <p><b>GitHub:</b> {profile.githubUrl}</p>

      <p><b>LeetCode:</b> {profile.leetcodeUrl}</p>

      <p><b>LinkedIn:</b> {profile.linkedinUrl}</p>

      <div>
        <b>Bio</b>

        <div className="border rounded-lg p-3 mt-2">
          {profile.bio}
        </div>
      </div>

    </div>
  );
}