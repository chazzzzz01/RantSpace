import styles from "./RantItem.module.css";

interface Rant {
  id: number;
  content: string;
  nickname?: string;
  createdAt: string;
}

export default function RantItem({ rant }: { rant: Rant }) {
  return (
    <div className={styles.rant}>
      <div className={styles.meta}>
        {rant.nickname || "Anonymous"} —{" "}
        {new Date(rant.createdAt).toLocaleString()}
      </div>
      <p className={styles.text}>{rant.content}</p>
    </div>
  );
}
