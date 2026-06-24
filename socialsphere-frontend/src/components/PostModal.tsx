import { X } from 'lucide-react';
import type { Post } from '../types';
import PostCard from './PostCard';

interface PostModalProps {
  post: Post;
  currentUsername: string;
  onClose: () => void;
  onUpdated: (post: Post) => void;
  onDeleted: (postId: number) => void;
}

export default function PostModal({ post, currentUsername, onClose, onUpdated, onDeleted }: PostModalProps) {
  const handleDeleted = (postId: number) => {
    onDeleted(postId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
          aria-label="Close"
        >
          <X size={26} />
        </button>
        <PostCard
          post={post}
          currentUsername={currentUsername}
          onUpdated={onUpdated}
          onDeleted={handleDeleted}
        />
      </div>
    </div>
  );
}