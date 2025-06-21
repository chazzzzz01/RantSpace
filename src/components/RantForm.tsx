import { useState } from "react";
import styles from "./RantForm.module.css";

// Define the Rant object shape properly
interface Rant {
  id: number;
  content: string;
  nickname?: string | null;
  createdAt: string;
}

interface Props {
  onNewRant: (rant: Rant) => void;
}

export default function RantForm({ onNewRant }: Props) {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/rants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, nickname: nickname.trim() || null }),
      });

      if (!res.ok) {
        console.error("Failed to post rant");
        return;
      }

      const newRant: Rant = await res.json();
      onNewRant(newRant);

      setContent("");
      setNickname("");
      setShowForm(false); // optionally hide after submit
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className={styles.centerWrapper}>
        <button className={styles.revealButton} onClick={() => setShowForm(true)}>
          Start Rant
        </button>
      </div>
    );
  }

  return (
    <div className={styles.centerWrapper}>
      <div className={styles.formWrapper}>
        <button className={styles.closeButton} onClick={() => setShowForm(false)}>
          ✖
        </button>
        <form className={styles.form} onSubmit={submit}>
          <input
            className={styles.input}
            placeholder="Nickname"
            value={nickname}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNickname(e.target.value)
            }
          />
          <textarea
            className={styles.textarea}
            placeholder="Let it all out…"
            rows={4}
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setContent(e.target.value)
            }
          />
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Ranting…" : "RANT"}
          </button>
        </form>
      </div>
    </div>
  );
}
