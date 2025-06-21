import { useState } from "react";
import styles from "./RantForm.module.css";
import { Rant } from "../types";

interface Props {
  onNewRant: (rant: Rant) => void;
}

export default function RantForm({ onNewRant }: Props) {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
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
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className={styles.centerWrapper}>
        <button
          className={styles.revealButton}
          onClick={() => setShowForm(true)}
        >
          Start Rant
        </button>
      </div>
    );
  }

  return (
    <div className={styles.centerWrapper}>
      <div className={styles.formWrapper}>
        <button
          className={styles.closeButton}
          onClick={() => setShowForm(false)}
        >
          ✖
        </button>
        <form className={styles.form} onSubmit={submit}>
          <input
            className={styles.input}
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <textarea
            className={styles.textarea}
            placeholder="Let it all out…"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {error && <p className={styles.errorText}>{error}</p>}
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Ranting…" : "RANT"}
          </button>
        </form>
      </div>
    </div>
  );
}
