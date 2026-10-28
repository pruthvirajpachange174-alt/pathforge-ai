/** Renders the Profile Header interface component. */
type Props = {
  editing: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
};

export default function ProfileHeader({
  editing,
  onToggleEdit,
  onSave,
}: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">
        My Profile
      </h1>

      <div className="flex gap-3">
        {editing && (
          <button
            onClick={onSave}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition"
          >
            💾 Save Changes
          </button>
        )}

        <button
          onClick={onToggleEdit}
          className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 transition"
        >
          {editing ? "Cancel" : "✏️ Edit Profile"}
        </button>
      </div>
    </div>
  );
}