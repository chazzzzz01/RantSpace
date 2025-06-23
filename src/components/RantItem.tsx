import { useEffect, useState, useCallback } from "react";
import styles from "./RantItem.module.css";
import { Rant } from "../types";
import axios from "axios";

type Emoji = "angry" | "sad" | "funny" | "relatable" | "wow";

interface EmojiReaction {
  emoji: Emoji;
  count: number;
}

const emojiIcons: Record<Emoji, string> = {
  angry: "😡",
  sad: "😢",
  funny: "😂",
  relatable: "🙌",
  wow: "😲",
};

export default function RantItem({ rant }: { rant: Rant }) {
  const [emojiCounts, setEmojiCounts] = useState<Record<Emoji, number>>({
    angry: 0,
    sad: 0,
    funny: 0,
    relatable: 0,
    wow: 0,
  });

  const [clickedEmojis, setClickedEmojis] = useState<Set<Emoji>>(new Set());

  const fetchReactions = useCallback(async () => {
    try {
      const res = await axios.get<EmojiReaction[]>(`/api/reactions/${rant.id}`);
      const counts: Record<Emoji, number> = {
        angry: 0,
        sad: 0,
        funny: 0,
        relatable: 0,
        wow: 0,
      };
      res.data.forEach((reaction) => {
        counts[reaction.emoji] = reaction.count;
      });
      setEmojiCounts(counts);
    } catch (err) {
      console.error("Failed to fetch emoji reactions", err);
    }
  }, [rant.id]);

  const handleEmojiClick = async (emoji: Emoji) => {
    if (clickedEmojis.has(emoji)) return; // Prevent spam

    try {
      await axios.post(`/api/reactions/${rant.id}`, { emoji });

      setClickedEmojis((prev) => new Set(prev).add(emoji)); // Mark as clicked
      await fetchReactions(); // Refresh counts
    } catch (err) {
      console.error("Failed to update emoji reaction", err);
    }
  };

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  return (
    <div className={styles.rant}>
      <div className={styles.meta}>
        {rant.nickname || "Anonymous"} — {new Date(rant.createdAt).toLocaleString()}
      </div>

      <p className={styles.text}>{rant.content}</p>

      <div className={styles.emojis}>
        {(Object.keys(emojiIcons) as Emoji[]).map((emoji) => (
          <div
            key={emoji}
            className={`${styles.emoji} ${
              clickedEmojis.has(emoji) ? styles.active : ""
            }`}
            onClick={() => handleEmojiClick(emoji)}
          >
            {emojiIcons[emoji]}
            {emojiCounts[emoji] > 0 && (
              <span className={styles.count}>{emojiCounts[emoji]}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

