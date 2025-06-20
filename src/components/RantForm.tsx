import { useState } from "react";
import styles from "./RantForm.module.css";

interface Props {
  onNewRant: (rant: any) => void;
}

export default function RantForm({ onNewRant }: Props) {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const res = await fetch("/api/rants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, nickname: nickname.trim() || null }),
    });

    const newRant = await res.json();
    onNewRant(newRant);
    setContent("");
    setNickname("");
    setLoading(false);
    setShowForm(false); // optionally hide after submit
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
            onChange={(e) => setNickname(e.target.value)}
          />
          <textarea
            className={styles.textarea}
            placeholder="Let it all out…"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Ranting…" : "RANT"}
          </button>
        </form>
      </div>
    </div>
  );
}
