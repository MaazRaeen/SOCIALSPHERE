import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getUserProfile, updateProfile } from '../api/userApi';
import ImageUploadInput from '../components/ImageUploadInput';

export default function EditProfile() {
  const { username } = useAuth();
  const navigate = useNavigate();
  const [bio, setBio] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!username) return;
    getUserProfile(username).then((data) => {
      setBio(data.bio || '');
      setProfilePictureUrl(data.profilePictureUrl || '');
      setLoading(false);
    });
  }, [username]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setSaving(true);
    try {
      await updateProfile(username, { bio, profilePictureUrl });
      navigate(`/profile/${username}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500 text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-500 dark:text-gray-400 text-sm block mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell people about yourself..."
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>
        <div>
          <label className="text-gray-500 dark:text-gray-400 text-sm block mb-1">Profile Picture</label>
          <ImageUploadInput value={profilePictureUrl} onChange={setProfilePictureUrl} allowVideo={false} />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg py-2.5 hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}