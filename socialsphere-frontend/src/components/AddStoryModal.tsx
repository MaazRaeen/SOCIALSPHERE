import { useState } from 'react';
import { X } from 'lucide-react';
import { createStory } from '../api/storyApi';
import ImageUploadInput from './ImageUploadInput';

interface AddStoryModalProps {
  username: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function AddStoryModal({ username, onClose, onCreated }: AddStoryModalProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [posting, setPosting] = useState(false);

  const handleShare = async () => {
    if (!imageUrl) return;
    setPosting(true);
    try {
      await createStory(username, imageUrl);
      onCreated();
      onClose();
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <h2 className="font-semibold text-gray-900 dark:text-white">Add to your story</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <ImageUploadInput value={imageUrl} onChange={setImageUrl} />
          <button
            onClick={handleShare}
            disabled={posting || !imageUrl}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg py-2.5 hover:opacity-90 transition disabled:opacity-50"
          >
            {posting ? 'Sharing...' : 'Share to story'}
          </button>
          <p className="text-xs text-gray-400 text-center">Disappears after 24 hours</p>
        </div>
      </div>
    </div>
  );
}