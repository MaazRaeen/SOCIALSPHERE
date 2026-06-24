import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getUserProfile } from '../api/userApi';
import { getPostsByUsername } from '../api/postApi';
import { toggleFollow, getFollowStatus, getFollowCounts, getFollowers, getFollowing } from '../api/followApi';
import type { User, Post, FollowCounts } from '../types';
import PostModal from '../components/PostModal';
import FollowListModal from '../components/FollowListModal';
import { Play } from 'lucide-react';
import { isVideoUrl } from '../utils/media';

export default function Profile() {
  const { username: profileUsername } = useParams<{ username: string }>();
  const { username: currentUsername } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadedUsername, setLoadedUsername] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [counts, setCounts] = useState<FollowCounts>({ followerCount: 0, followingCount: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [listModal, setListModal] = useState<'followers' | 'following' | null>(null);
  const [listUsers, setListUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!profileUsername) return;
    Promise.all([getUserProfile(profileUsername), getPostsByUsername(profileUsername), getFollowCounts(profileUsername)]).then(
      ([userData, postsData, countsData]) => {
        setProfile(userData);
        setPosts(postsData);
        setCounts(countsData);
        setLoadedUsername(profileUsername);
      }
    );
  }, [profileUsername]);

  useEffect(() => {
    if (!profileUsername || !currentUsername || profileUsername === currentUsername) return;
    getFollowStatus(profileUsername, currentUsername).then(setIsFollowing);
  }, [profileUsername, currentUsername]);

  const handlePostUpdated = (updated: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedPost(updated);
  };

  const handlePostDeleted = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleFollowToggle = async () => {
    if (!profileUsername || !currentUsername) return;
    setFollowBusy(true);
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setCounts((prev) => ({ ...prev, followerCount: prev.followerCount + (wasFollowing ? -1 : 1) }));
    try {
      await toggleFollow(profileUsername, currentUsername);
    } catch {
      setIsFollowing(wasFollowing);
      setCounts((prev) => ({ ...prev, followerCount: prev.followerCount + (wasFollowing ? 1 : -1) }));
    } finally {
      setFollowBusy(false);
    }
  };

  const openFollowers = async () => {
    if (!profileUsername) return;
    const data = await getFollowers(profileUsername);
    setListUsers(data);
    setListModal('followers');
  };

  const openFollowing = async () => {
    if (!profileUsername) return;
    const data = await getFollowing(profileUsername);
    setListUsers(data);
    setListModal('following');
  };

  const loading = loadedUsername !== profileUsername;

  if (loading) return <p className="text-gray-500 text-center mt-10">Loading profile...</p>;
  if (!profile) return <p className="text-gray-500 text-center mt-10">User not found.</p>;

  const isOwnProfile = currentUsername === profile.username;
  const initial = profile.username.charAt(0).toUpperCase();

  return (
    <div>
      <div className="flex items-center gap-6 mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 overflow-hidden">
          {profile.profilePictureUrl ? (
            <img src={profile.profilePictureUrl} alt={profile.username} className="w-full h-full object-cover" />
          ) : (
            initial
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.username}</h1>
            {isOwnProfile ? (
              <Link
                to="/profile/edit"
                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Edit profile
              </Link>
            ) : (
              <button
                onClick={handleFollowToggle}
                disabled={followBusy}
                className={`text-sm px-4 py-1.5 rounded-lg font-semibold transition disabled:opacity-50 ${
                  isFollowing
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <div className="flex gap-4 mt-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">{posts.length} posts</span>
            <button onClick={openFollowers} className="text-gray-700 dark:text-gray-300 hover:underline">
              <span className="font-semibold text-gray-900 dark:text-white">{counts.followerCount}</span> followers
            </button>
            <button onClick={openFollowing} className="text-gray-700 dark:text-gray-300 hover:underline">
              <span className="font-semibold text-gray-900 dark:text-white">{counts.followingCount}</span> following
            </button>
          </div>

          {profile.bio && <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{profile.bio}</p>}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="aspect-square bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center p-2 overflow-hidden hover:opacity-80 transition"
              >
                {post.imageUrl ? (
                    isVideoUrl(post.imageUrl) ? (
                      <div className="relative w-full h-full">
                        <video src={post.imageUrl} className="w-full h-full object-cover rounded-lg" muted />
                        <Play size={16} className="absolute bottom-1.5 right-1.5 text-white drop-shadow" />
                      </div>
                    ) : (
                      <img src={post.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                    )
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-xs text-center line-clamp-4">{post.content}</p>
                  )}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedPost && currentUsername && (
        <PostModal
          post={selectedPost}
          currentUsername={currentUsername}
          onClose={() => setSelectedPost(null)}
          onUpdated={handlePostUpdated}
          onDeleted={handlePostDeleted}
        />
      )}

      {listModal && (
        <FollowListModal
          title={listModal === 'followers' ? 'Followers' : 'Following'}
          users={listUsers}
          onClose={() => setListModal(null)}
        />
      )}
    </div>
  );
}