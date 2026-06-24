import { useState } from 'react';
import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import { createPost } from '../api/postApi';
import ImageUploadInput from './ImageUploadInput';

interface CreatePostModalProps {
  username: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreatePostModal({ username, onClose, onCreated }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [posting, setPosting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    try {
      await createPost(username, content, imageUrl || undefined);
      onCreated();
      onClose();
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <h2 className="font-semibold text-gray-900 dark:text-white">Create new post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <textarea
            autoFocus
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
          <ImageUploadInput value={imageUrl} onChange={setImageUrl} />
          <button
            type="submit"
            disabled={posting || !content.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg py-2.5 hover:opacity-90 transition disabled:opacity-50"
          >
            {posting ? 'Sharing...' : 'Share'}
          </button>
        </form>
      </div>
    </div>
  );
}