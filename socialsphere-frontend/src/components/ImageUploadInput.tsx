import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { uploadFile } from '../api/uploadApi';
import { isVideoUrl } from '../utils/media';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  allowVideo?: boolean;
}

export default function ImageUploadInput({ value, onChange, allowVideo = true }: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const accept = allowVideo ? 'image/*,video/*' : 'image/*';

  return (
    <div>
      {value ? (
        <div className="relative mb-2">
          {isVideoUrl(value) ? (
            <video src={value} controls className="w-full max-h-60 rounded-lg bg-black" />
          ) : (
            <img src={value} alt="Preview" className="w-full max-h-60 object-contain rounded-lg bg-gray-100 dark:bg-black" />
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
            aria-label="Remove media"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg py-4 text-gray-500 dark:text-gray-400 hover:border-purple-400 dark:hover:border-purple-500 transition disabled:opacity-50"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
          {uploading ? 'Uploading...' : allowVideo ? 'Upload photo or video' : 'Upload photo'}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}