import { useEffect, useState, useCallback } from "react";
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
    if (clickedEmojis.has(emoji)) return;

    try {
      await axios.post(`/api/reactions/${rant.id}`, { emoji });
      setClickedEmojis((prev) => new Set(prev).add(emoji));
      await fetchReactions();
    } catch (err) {
      console.error("Failed to update emoji reaction", err);
    }
  };

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  return (
    <div
      className="
        bg-[#222] 
        p-4 
        rounded-lg 
        shadow 
        mb-6 
        w-full 
        max-w-3xl 
        mx-auto 
        lg:px-8 
        lg:py-6
      "
    >
      <div className="text-sm text-[var(--accent)] mb-2">
        {rant.nickname || "Anonymous"} — {new Date(rant.createdAt).toLocaleString()}
      </div>

      <p className="text-white whitespace-pre-wrap mb-4">{rant.content}</p>

      <div className="flex gap-3 flex-wrap mt-3">
        {(Object.keys(emojiIcons) as Emoji[]).map((emoji) => (
          <div
            key={emoji}
            onClick={() => handleEmojiClick(emoji)}
            className={`cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-md text-lg transition select-none
              ${
                clickedEmojis.has(emoji)
                  ? "bg-[var(--accent)] text-black"
                  : "bg-[#333] text-white hover:bg-[var(--accent)] hover:text-black"
              }`}
          >
            {emojiIcons[emoji]}
            {emojiCounts[emoji] > 0 && (
              <span className="text-sm font-semibold">{emojiCounts[emoji]}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
