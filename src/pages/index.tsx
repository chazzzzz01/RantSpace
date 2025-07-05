import { useState, useEffect } from "react";
import RantForm from "../components/RantForm";
import RantList from "../components/RantList";
import SearchRantsByNickname from "../components/SearchRantsByNickname";
import { Rant } from "../types";

export default function Home() {
  const [rants, setRants] = useState<Rant[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Fetch all rants on initial load
  useEffect(() => {
    fetch("/api/rants")
      .then((res) => res.json())
      .then(setRants)
      .catch((err) => console.error("Failed to fetch rants:", err));
  }, []);

  // Handle new rant submission from RantForm
  const handleNewRant = (rant: Rant) => {
    setRants((prev) => [rant, ...prev]);
  };

  return (
    <main
      className="container"
      style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}
    >
      <h1 style={{ color: "#f1f1f1", marginBottom: "1rem" }}>🚀 RantSpace</h1>

      {/* Action Buttons Side by Side */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={() => setShowForm((prev) => !prev)}

          className="bg-[var(--accent)] text-black px-6 py-2 rounded-md font-semibold hover:bg-[#32cc10] transition"

        >
          Start Rant
        </button>
        <button
          onClick={() => setShowSearch((prev) => !prev)}

          className="bg-[var(--accent)] text-black px-6 py-2 rounded-md font-semibold hover:bg-[#32cc10] transition"

        >
           Search Nickname
        </button>
      </div>

      {/* Conditionally Render Components */}
      {showForm && <RantForm onNewRant={handleNewRant} />}
      {showSearch && <SearchRantsByNickname />}

      {/* List all rants */}
      <RantList rants={rants} />
    </main>
  );
}
