import { useState } from "react";
import { Rant } from "../types";

interface Props {
  onNewRant: (rant: Rant) => void;
}

export default function RantForm({ onNewRant }: Props) {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Rant content cannot be empty.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/rants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          nickname: nickname.trim() || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit rant.");

      const newRant: Rant = await res.json();
      onNewRant(newRant);
      setContent("");
      setNickname("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="w-full max-w-xl bg-[#1a1a2e] p-6 rounded-lg shadow-lg">
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="bg-[#121221] text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring focus:ring-[var(--accent)]"
          />
          <textarea
            placeholder="Let it all out…"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-[#121221] text-white px-4 py-2 rounded border border-gray-600 resize-none focus:outline-none focus:ring focus:ring-[var(--accent)]"
          />
          {error && (
            <p className="text-red-400 text-sm text-left">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--accent)] text-black font-bold py-2 rounded hover:bg-[#32cc10] transition disabled:opacity-50"
          >
            {loading ? "Ranting…" : "RANT"}
          </button>
        </form>
      </div>
    </div>
  );
}
