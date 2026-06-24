import { useState } from 'react';
import type { FormEvent } from 'react';
import { createPost } from '../api/postApi';
import type { Post } from '../types';

interface CreatePostProps {
  username: string;
  onPostCreated: (post: Post) => void;
}

export default function CreatePost({ username, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [posting, setPosting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    try {
      const newPost = await createPost(username, content, imageUrl || undefined);
      onPostCreated(newPost);
      setContent('');
      setImageUrl('');
    } finally {
      setPosting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6">
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 resize-none"
      />
      <input
        type="text"
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 mt-2 outline-none focus:ring-2 focus:ring-purple-500"
      />
      <div className="flex justify-end mt-3">
        <button
          type="submit"
          disabled={posting || !content.trim()}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg px-5 py-2 hover:opacity-90 transition disabled:opacity-50"
        >
          {posting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
}