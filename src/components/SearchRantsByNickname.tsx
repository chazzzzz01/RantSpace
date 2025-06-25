import { useState } from "react";
import axios from "axios";
import { Rant } from "../types";

export default function SearchRantsByNickname() {
  const [nickname, setNickname] = useState("");
  const [results, setResults] = useState<Rant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!nickname.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);
    setSearched(false);

    try {
      const res = await axios.get(`/api/rants/search?nickname=${encodeURIComponent(nickname)}`);
      setResults(res.data);
      setSearched(true);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch rants.");
    } finally {
      setLoading(false);
    }
  };

  const showResultsOverlay = results.length > 0;

  return (
    <div className="relative text-white text-center">
      <h2 className="text-xl font-bold mb-4">Search Rants by Nickname</h2>

      <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Enter nickname..."
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="px-3 py-2 rounded border border-gray-600 bg-[#121221] text-white w-full sm:w-64"
        />
        <button
          onClick={handleSearch}
          className="bg-[var(--accent)] text-white px-4 py-2 rounded font-medium hover:bg-[#ff5a5a] transition"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-300">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {/* Results overlay - glassy, lower on the screen */}
      {showResultsOverlay && (
        <div className="absolute inset-0 z-10 bg-[#0e0e1acc] backdrop-blur-sm px-4 flex justify-center items-end pb-[10vh]">
          <div className="w-full sm:w-[500px] max-h-[60vh] overflow-y-auto bg-[#1d1d2f]/90 backdrop-blur-md p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-center text-[var(--accent)] mb-4 mt-2">
              Results for: "{nickname}"
            </h3>

            {results.map((rant) => (
              <div key={rant.id} className="bg-[#2e2e3e] p-4 rounded mb-3">
                <div className="text-sm text-[var(--accent)] mb-1">
                  {rant.nickname || "Anonymous"} —{" "}
                  {new Date(rant.createdAt).toLocaleString()}
                </div>
                <p className="text-gray-100 whitespace-pre-wrap">{rant.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "No results" below form */}
      {!loading && searched && results.length === 0 && (
        <p className="text-gray-300 mt-4">
          No rants found for "<span className="text-[var(--accent)]">{nickname}</span>".
        </p>
      )}
    </div>
  );
}
