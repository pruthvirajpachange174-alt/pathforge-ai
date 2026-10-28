/** Renders the Tag Input interface component. */
import { useState } from "react";
import { X } from "lucide-react";

type TagInputProps = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

export default function TagInput({
  label,
  values,
  onChange,
  placeholder,
}: TagInputProps) {
  const [input, setInput] = useState("");

  function addTag() {
    const value = input.trim();

    if (!value) return;

    if (values.includes(value)) {
      setInput("");
      return;
    }

    onChange([...values, value]);

    setInput("");
  }

  function removeTag(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }

  return (
    <div className="space-y-2">

      <label className="font-semibold">
        {label}
      </label>

      <div className="flex flex-wrap gap-2">

        {values.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-full bg-violet-600 px-3 py-1 text-sm text-white"
          >
            <span>{tag}</span>

            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:text-red-200"
            >
              <X size={14} />
            </button>
          </div>
        ))}

      </div>

      <div className="flex gap-2">

        <input
          type="text"
          value={input}
          placeholder={placeholder ?? "Add item"}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-xl border border-neutral-700 bg-neutral-800 p-3"
        />

        <button
          type="button"
          onClick={addTag}
          className="rounded-xl bg-violet-600 px-5 hover:bg-violet-700 transition"
        >
          Add
        </button>

      </div>

    </div>
  );
}