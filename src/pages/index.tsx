import { useState, useEffect } from "react";
import RantForm from "../components/RantForm";
import RantList from "../components/RantList";

type Rant = {
  id: number;
  content: string;
  nickname?: string;
  createdAt: string;
};

export default function Home() {
  const [rants, setRants] = useState<Rant[]>([]);

  useEffect(() => {
    fetch("/api/rants")
      .then((res) => res.json())
      .then(setRants);
  }, []);

  const handleNewRant = (rant: Rant) => {
    setRants((prev) => [rant, ...prev]);
  };

  return (
    <div className="container">
      <h1>🚀 RantSpace</h1>
      <RantForm onNewRant={handleNewRant} />
      <RantList rants={rants} />
    </div>
  );
}
