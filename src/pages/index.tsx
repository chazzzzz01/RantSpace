import { useState, useEffect } from "react";
import RantForm from "../components/RantForm";
import RantList from "../components/RantList";
import { Rant } from "../types";

export default function Home() {
  const [rants, setRants] = useState<Rant[]>([]);

  useEffect(() => {
    fetch("/api/rants")
      .then((res) => res.json())
      .then(setRants)
      .catch((err) => console.error("Failed to fetch rants:", err));
  }, []);

  const handleNewRant = (rant: Rant) => {
    setRants((prev) => [rant, ...prev]);
  };

  return (
    <main className="container">
      <h1>🚀 RantSpace</h1>
      <RantForm onNewRant={handleNewRant} />
      <RantList rants={rants} />
    </main>
  );
}
