import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import type { Post, Comment } from '../types';
import { toggleLike, getLikeCount, getComments, addComment, updatePost, deletePost } from '../api/postApi';
import ImageUploadInput from './ImageUploadInput';
import { isVideoUrl } from '../utils/media';

interface PostCardProps {
  post: Post;
  currentUsername: string;
  onUpdated?: (post: Post) => void;
  onDeleted?: (postId: number) => void;
}

export default function PostCard({ post, currentUsername, onUpdated, onDeleted }: PostCardProps) {
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editImageUrl, setEditImageUrl] = useState(post.imageUrl ?? '');
  const [saving, setSaving] = useState(false);

  const isOwner = post.author.username === currentUsername;

  useEffect(() => {
    getLikeCount(post.id)
      .then(setLikeCount)
      .catch(() => setLikeCount(0));
  }, [post.id]);

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((prev) => (prev === null ? prev : prev + (wasLiked ? -1 : 1)));
    try {
      await toggleLike(post.id, currentUsername);
    } catch {
      setLiked(wasLiked);
      setLikeCount((prev) => (prev === null ? prev : prev + (wasLiked ? 1 : -1)));
    }
  };

  const loadComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    setShowComments(true);
    if (comments === null) {
      setLoadingComments(true);
      try {
        const data = await getComments(post.id);
        setComments(data);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = await addComment(post.id, currentUsername, commentText);
    setComments((prev) => (prev ? [...prev, newComment] : [newComment]));
    setCommentText('');
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      const updated = await updatePost(post.id, currentUsername, editContent, editImageUrl || undefined);
      onUpdated?.(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    await deletePost(post.id, currentUsername);
    onDeleted?.(post.id);
  };

  const initial = post.author.username.charAt(0).toUpperCase();

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl mb-6 overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white flex-shrink-0 overflow-hidden">
          {post.author.profilePictureUrl ? (
            <img src={post.author.profilePictureUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            initial
          )}
        </div>
        <div className="flex-1">
          <Link
            to={`/profile/${post.author.username}`}
            className="text-gray-900 dark:text-white font-semibold text-sm hover:underline"
          >
            {post.author.username}
          </Link>
          <p className="text-gray-500 text-xs">{new Date(post.createdAt).toLocaleString()}</p>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              aria-label="Post options"
            >
              <MoreHorizontal size={18} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden">
                <button
                  onClick={() => {
                    setEditing(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleDelete();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSaveEdit} className="px-4 pb-4 space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
          <ImageUploadInput value={editImageUrl} onChange={setEditImageUrl} />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-sm px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="text-sm px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
            ) : (
        <>
          <div className="px-4 pb-3">
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {post.imageUrl &&
            (isVideoUrl(post.imageUrl) ? (
              <video
                src={post.imageUrl}
                controls
                className="w-full max-h-[500px] bg-black"
              />
            ) : (
              <div className="w-full max-h-[500px] bg-gray-100 dark:bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="w-full max-h-[500px] object-contain"
                />
              </div>
            ))}

          <div className="flex items-center gap-4 px-4 py-3">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 text-sm"
            >
              <span>{liked ? '❤️' : '🤍'}</span>
              <span className="text-gray-500 dark:text-gray-400">
                {likeCount ?? '...'}
              </span>
            </button>

            <button
              onClick={loadComments}
              className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white transition"
            >
              💬 {showComments ? 'Hide comments' : 'View comments'}
            </button>
          </div>

          {showComments && (
            <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3 space-y-3">
              {loadingComments && (
                <p className="text-gray-500 text-sm">
                  Loading comments...
                </p>
              )}

              {comments?.map((c) => (
                <div key={c.id} className="text-sm">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {c.author.username}
                  </span>{' '}
                  <span className="text-gray-600 dark:text-gray-300">
                    {c.content}
                  </span>
                </div>
              ))}

              {comments?.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No comments yet. Be the first!
                </p>
              )}

              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                />

                <button
                  type="submit"
                  className="text-purple-500 dark:text-purple-400 text-sm font-semibold hover:text-purple-600 dark:hover:text-purple-300 transition"
                >
                  Post
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}