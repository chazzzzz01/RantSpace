'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Rant } from '../types';

type Emoji = 'love' | 'angry' | 'sad' | 'funny' | 'relatable' | 'wow';

interface EmojiReaction {
  emoji: Emoji;
  count: number;
}

interface Reply {
  id: string;
  content: string;
  createdAt: string;
  rantId: number;
}

const emojiIcons: Record<Emoji, string> = {
  love: '❤️',
  angry: '😡',
  sad: '😢',
  funny: '😂',
  relatable: '🙌',
  wow: '😲',
};

export default function RantItem({ rant }: { rant: Rant }) {
  const [emojiCounts, setEmojiCounts] = useState<Record<Emoji, number>>({
    love: 0,
    angry: 0,
    sad: 0,
    funny: 0,
    relatable: 0,
    wow: 0,
  });

  const [clickedEmojis, setClickedEmojis] = useState<Set<Emoji>>(new Set());
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [showFullText, setShowFullText] = useState(false); // ✅ Text toggle

  const fetchReactions = useCallback(async () => {
    try {
      const res = await axios.get<EmojiReaction[]>(`/api/reactions/${rant.id}`);
      const counts: Record<Emoji, number> = {
        love: 0,
        angry: 0,
        sad: 0,
        funny: 0,
        relatable: 0,
        wow: 0,
      };
      res.data.forEach((reaction) => {
        counts[reaction.emoji as Emoji] = reaction.count;
      });
      setEmojiCounts(counts);
    } catch (err) {
      console.error('Failed to fetch emoji reactions', err);
    }
  }, [rant.id]);

  const fetchReplies = useCallback(async () => {
    try {
      const res = await axios.get<Reply[]>(`/api/rants/${rant.id}/reply`);
      setReplies(res.data);
    } catch (err) {
      console.error('Failed to fetch replies', err);
    }
  }, [rant.id]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  const handleEmojiClick = async (emoji: Emoji) => {
    if (clickedEmojis.has(emoji)) return;

    try {
      await axios.post(`/api/reactions/${rant.id}`, { emoji });
      setClickedEmojis((prev) => new Set(prev).add(emoji));
      await fetchReactions();
    } catch (err) {
      console.error('Failed to update emoji reaction', err);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`/api/rants/${rant.id}/reply`, {
        content: replyContent,
      });
      setReplyContent('');
      setShowReplyForm(false);
      await fetchReplies();
      setShowReplies(true);
    } catch (err) {
      console.error('Failed to submit reply', err);
      alert('Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleReplies = async () => {
    if (!showReplies && replies.length === 0) {
      await fetchReplies(); // Fetch once
    }
    setShowReplies((prev) => !prev);
  };

  return (
    <div
      className="bg-[#222] p-4 rounded-lg shadow mb-6 w-full max-w-3xl mx-auto relative lg:px-8 lg:py-6 cursor-pointer transition-all"
      onClick={() => setShowFullText((prev) => !prev)}
    >
      <div className="text-sm text-[var(--accent)] mb-2">
        {rant.nickname || 'Anonymous'} — {new Date(rant.createdAt).toLocaleString()}
      </div>

      <p
        className={`text-white whitespace-pre-wrap mb-4 transition-all duration-300 ease-in-out ${
          showFullText ? '' : 'line-clamp-4'
        }`}
      >
        {rant.content}
      </p>

      <div className="flex gap-3 flex-wrap mt-3">
        {(Object.keys(emojiIcons) as Emoji[]).map((emoji) => (
          <div
            key={emoji}
            onClick={(e) => {
              e.stopPropagation(); // Prevent expanding text on emoji click
              handleEmojiClick(emoji);
            }}
            className={`cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-md text-lg transition select-none ${
              clickedEmojis.has(emoji)
                ? 'bg-[var(--accent)] text-black'
                : 'bg-[#333] text-white hover:bg-[var(--accent)] hover:text-black'
            }`}
          >
            {emojiIcons[emoji]}
            {emojiCounts[emoji] > 0 && (
              <span className="text-sm font-semibold">{emojiCounts[emoji]}</span>
            )}
          </div>
        ))}
      </div>

      {/* Reply and Show Replies Controls */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleReplies();
          }}
          className="text-[var(--accent)] hover:underline text-xs"
        >
          {showReplies ? '⬅️ Hide Replies' : '➡️ Show Replies'} ({replies.length})
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowReplyForm((prev) => !prev);
          }}
          className="text-black bg-[var(--accent)] hover:bg-pink-500 px-4 py-2 rounded-full text-sm font-semibold shadow transition"
        >
          {showReplyForm ? 'Cancel' : 'Reply'}
        </button>
      </div>

      {showReplyForm && (
        <form
          onSubmit={handleReplySubmit}
          className="mt-4 p-4 bg-[#333] rounded-lg border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <label className="block text-white mb-2 text-sm">Your Reply</label>
          <textarea
            className="w-full p-2 rounded bg-[#111] text-white border border-gray-700 resize-none"
            placeholder="Write your reply..."
            rows={3}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 bg-[var(--accent)] hover:bg-pink-500 text-black font-semibold px-4 py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Reply'}
          </button>
        </form>
      )}

      {showReplies && (
        <div className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
          {replies.map((reply) => (
            <div
              key={reply.id}
              className="bg-[#111] text-white px-4 py-2 rounded-md border border-gray-700"
            >
              <div className="text-xs text-gray-400 mb-1">
                {new Date(reply.createdAt).toLocaleString()}
              </div>
              <div>{reply.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
