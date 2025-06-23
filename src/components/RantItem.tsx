import { useState } from "react";
import styles from "./RantItem.module.css";
import { Rant } from "../types";

export default function RantItem({ rant }: { rant: Rant }) {
  const [emojiCounts, setEmojiCounts] = useState({
    angry: 0,
    sad: 0,
    funny: 0,
    relatable: 0,
    wow: 0,
  });

  const [userReactions, setUserReactions] = useState<{
    [key: string]: boolean;
  }>({
    angry: false,
    sad: false,
    funny: false,
    relatable: false,
    wow: false,
  });

  const handleEmojiClick = (emoji: keyof typeof emojiCounts) => {
    const alreadyReacted = userReactions[emoji];

    setEmojiCounts((prevCounts) => ({
      ...prevCounts,
      [emoji]: alreadyReacted ? prevCounts[emoji] - 1 : prevCounts[emoji] + 1,
    }));

    setUserReactions((prevReactions) => ({
      ...prevReactions,
      [emoji]: !prevReactions[emoji],
    }));
  };

  return (
    <div className={styles.rant}>
      <div className={styles.meta}>
        {rant.nickname || "Anonymous"} —{" "}
        {new Date(rant.createdAt).toLocaleString()}
      </div>
      <p className={styles.text}>{rant.content}</p>

      {/* Emoji bar with toggle counters */}
      <div className={styles.emojis}>
        {["angry", "sad", "funny", "relatable", "wow"].map((emoji) => (
          <div
            key={emoji}
            className={`${styles.emoji} ${
              userReactions[emoji] ? styles.active : ""
            }`}
            onClick={() => handleEmojiClick(emoji as keyof typeof emojiCounts)}
          >
            {emoji === "angry" && "😡"}
            {emoji === "sad" && "😢"}
            {emoji === "funny" && "😂"}
            {emoji === "relatable" && "🙌"}
            {emoji === "wow" && "😲"}
            {emojiCounts[emoji as keyof typeof emojiCounts] > 0 && (
              <span className={styles.count}>
                {emojiCounts[emoji as keyof typeof emojiCounts]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
