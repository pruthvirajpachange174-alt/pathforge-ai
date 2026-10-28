/** Renders the Profile application page. */
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileView from "@/components/profile/ProfileView";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileCompletion from "@/components/profile/ProfileCompletion";

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

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

const [form, setForm] = useState<UserProfile>({
  name: "",
  email: "",
  college: "",
  year: undefined,
  branch: "",
  careerGoal: "",
  city: "",
  skills: [],
  languages: [],
  interests: [],
  githubUrl: "",
  linkedinUrl: "",
  leetcodeUrl: "",
  bio: "",
});


  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await api.get("/profile");

      setProfile(res.data.data);
      setForm(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
/// to save changes made in profile 
async function handleSave() {
  try {
    const res = await api.put("/profile", form);

    setProfile(res.data.data);

    setEditing(false);

    alert("✅ Profile updated successfully!");
  } catch (err) {
    console.error(err);

    alert("❌ Failed to update profile");
  }
}

  if (loading) {
    return <h2 className="text-white p-6">Loading...</h2>;
  }

  if (!profile) {
    return <h2 className="text-red-500 p-6">Profile not found</h2>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
{/* PROFILE COMPLETION TRACKER */}
<ProfileCompletion profile={profile} />

      <ProfileHeader
  editing={editing}
  onToggleEdit={() => setEditing(!editing)}
  onSave={handleSave}
/>

      <div className="bg-neutral-900 rounded-2xl p-6 space-y-4">

  
{editing ? (
  <ProfileForm
    form={form}
    setForm={setForm}
  />
) : (
  <ProfileView profile={profile} />
)}

      </div>
    


    </div>
  );
}