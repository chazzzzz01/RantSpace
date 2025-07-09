import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Rant } from "../types";

export default function SearchRantsByNickname() {
  const [nickname, setNickname] = useState("");
  const [results, setResults] = useState<Rant[]>([]);
  const [confirmedResults, setConfirmedResults] = useState<Rant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch live nickname matches while typing
  useEffect(() => {
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    if (!nickname.trim()) {
      setResults([]);
      return;
    }

    typingTimeout.current = setTimeout(() => {
      fetchNicknameResults(nickname);
    }, 400);
  }, [nickname]);

  const fetchNicknameResults = async (query: string) => {
    try {
      const res = await axios.get(`/api/rants/search?nickname=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    if (!nickname.trim()) return;

    setLoading(true);
    setError("");
    setConfirmedResults([]);
    setHasSearched(true);

    try {
      const res = await axios.get(`/api/rants/search?nickname=${encodeURIComponent(nickname)}`);
      setConfirmedResults(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch rants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-[#1a1a2e] text-white p-6 rounded-lg text-center">
      <h2 className="text-xl font-bold mb-4">Search Rants by Nickname</h2>

      <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Enter nickname..."
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setConfirmedResults([]);
            setHasSearched(false);
          }}
          className="px-3 py-2 rounded border border-gray-600 bg-[#121221] text-white w-full sm:w-64"
        />
        <button
          onClick={handleSearch}
          className="bg-[var(--accent)] text-black px-4 py-2 rounded font-medium hover:bg-[#32cc10] transition"
        >
          Search
        </button>
      </div>

      {/* ✅ Live nickname count (silent if none) */}
      {nickname && results.length > 0 && !loading && !hasSearched && (
        <div className="mb-4 text-center">
          <p className="text-green-400">
            ✅ Found {results.length} nickname{results.length > 1 ? "s" : ""}
          </p>
        </div>
      )}

      {loading && <p className="text-gray-300">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {hasSearched && (
        <div className="mt-2 max-h-[70vh] overflow-y-auto w-full sm:w-[500px] mx-auto bg-[#222] p-6 rounded shadow-lg text-left">
          {confirmedResults.length > 0 ? (
            <>
              <h3 className="text-lg font-semibold mb-4 text-center">
                ✅ Showing {confirmedResults.length} rant
                {confirmedResults.length > 1 ? "s" : ""} for &quot;{nickname}&quot;
              </h3>
              {confirmedResults.map((rant) => (
                <div key={rant.id} className="bg-[#2e2e3e] p-4 rounded mb-3">
                  <div className="text-sm text-[var(--accent)] mb-1">
                    {rant.nickname || "Anonymous"} —{" "}
                    {new Date(rant.createdAt).toLocaleString()}
                  </div>
                  <p className="text-gray-100 whitespace-pre-wrap">{rant.content}</p>
                </div>
              ))}
            </>
          ) : (
            <p className="text-gray-300 text-center">
              ❌ No rants found for &quot;{nickname}&quot;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
