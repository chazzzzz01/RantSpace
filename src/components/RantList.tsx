import RantItem from "./RantItem";
import styles from "./RantList.module.css"; // New!

interface Rant {
  id: number;
  content: string;
  nickname?: string;
  createdAt: string;
}

export default function RantList({ rants }: { rants: Rant[] }) {
  return (
    <div className={styles.listWrapper}>
      {rants.map((rant) => (
        <div key={rant.id} className={styles.rantContainer}>
          <RantItem rant={rant} />
        </div>
      ))}
    </div>
  );
}

