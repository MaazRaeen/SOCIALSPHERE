import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getAllPosts } from '../api/postApi';
import { getActiveStories } from '../api/storyApi';
import type { Post, Story } from '../types';
import PostCard from '../components/PostCard';
import StoriesBar from '../components/Storiesbar';
import StoryViewer from '../components/StoryViewer';

export default function Feed() {
  const { username } = useAuth();
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStoryUser, setActiveStoryUser] = useState<string | null>(null);

  const refetchStories = () => {
    getActiveStories().then(setStories);
  };

  useEffect(() => {
    let isActive = true;

    Promise.resolve().then(() => {
      if (isActive) {
        setLoading(true);
      }
    });

    Promise.all([getAllPosts(), getActiveStories()])
      .then(([postsData, storiesData]) => {
        if (!isActive) return;
        setPosts(postsData);
        setStories(storiesData);
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [location.key]);

  const handlePostUpdated = (updated: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handlePostDeleted = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleStoryDeleted = (storyId: number) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
  };

  const activeStories = useMemo(() => {
    if (!activeStoryUser) return [];
    return stories
      .filter((s) => s.author.username === activeStoryUser)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [activeStoryUser, stories]);

  if (!username) return null;

  return (
    <div>
      <StoriesBar
        stories={stories}
        currentUsername={username}
        onSelectUser={setActiveStoryUser}
        onStoryAdded={refetchStories}
      />
      {loading && <p className="text-gray-500 text-center">Loading feed...</p>}
      {!loading && posts.length === 0 && (
        <p className="text-gray-500 text-center">No posts yet. Tap the + icon to share something!</p>
      )}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUsername={username}
          onUpdated={handlePostUpdated}
          onDeleted={handlePostDeleted}
        />
      ))}

      {activeStoryUser && activeStories.length > 0 && (
        <StoryViewer
          stories={activeStories}
          startIndex={0}
          currentUsername={username}
          onClose={() => setActiveStoryUser(null)}
          onDeleted={handleStoryDeleted}
        />
      )}
    </div>
  );
}