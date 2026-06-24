import { useState, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import type { Story } from '../types';
import { deleteStory } from '../api/storyApi';
import { isVideoUrl } from '../utils/media';

interface StoryViewerProps {
  stories: Story[];
  startIndex: number;
  currentUsername: string;
  onClose: () => void;
  onDeleted: (storyId: number) => void;
}

const STORY_DURATION = 5000;

export default function StoryViewer({ stories, startIndex, currentUsername, onClose, onDeleted }: StoryViewerProps) {
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIndex((i) => {
            if (i < stories.length - 1) return i + 1;
            onClose();
            return i;
          });
          return 0;
        }
        return prev + 100 / (STORY_DURATION / 100);
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [stories.length, onClose]);

  const goNext = () => {
    setProgress(0);
    if (index < stories.length - 1) setIndex((i) => i + 1);
    else onClose();
  };

  const goPrev = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
      setProgress(0);
    }
  };

  const current = stories[index];
  if (!current) return null;

  const isOwner = current.author.username === currentUsername;

  const handleDelete = async () => {
    if (!window.confirm('Delete this story?')) return;
    await deleteStory(current.id, currentUsername);
    onDeleted(current.id);
    if (stories.length <= 1) {
      onClose();
    } else if (index === stories.length - 1) {
      setIndex((i) => i - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      <div className="relative w-full max-w-md h-full sm:h-[85vh] sm:rounded-2xl overflow-hidden bg-gray-950">
        <div className="absolute top-3 left-3 right-3 flex gap-1 z-20">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: i < index ? '100%' : i === index ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        <div className="absolute top-7 left-3 right-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
              {current.author.profilePictureUrl ? (
                <img src={current.author.profilePictureUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                current.author.username.charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-white text-sm font-semibold">{current.author.username}</span>
          </div>
          <div className="flex items-center gap-3">
            {isOwner && (
              <button onClick={handleDelete} className="text-white/90 hover:text-white" aria-label="Delete story">
                <Trash2 size={20} />
              </button>
            )}
            <button onClick={onClose} className="text-white text-2xl leading-none px-1" aria-label="Close">
              &times;
            </button>
          </div>
        </div>

        {isVideoUrl(current.imageUrl) ? (
          <video
            src={current.imageUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <img src={current.imageUrl} alt="" className="w-full h-full object-contain bg-black" />
        )}

        <button onClick={goPrev} className="absolute left-0 top-0 w-1/3 h-full" aria-label="Previous" />
        <button onClick={goNext} className="absolute right-0 top-0 w-1/3 h-full" aria-label="Next" />
      </div>
    </div>
  );
}