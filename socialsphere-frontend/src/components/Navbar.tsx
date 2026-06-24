import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, PlusSquare, MessageCircle, Settings as SettingsIcon, Sun, Moon, Search } from 'lucide-react';import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/useTheme';
import NotificationBell from './notificationBell';
import CreatePostModal from './CreatePostModal';

export default function Navbar() {
  const { username } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  const initial = username ? username.charAt(0).toUpperCase() : '?';

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              SocialSphere
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4 text-gray-600 dark:text-gray-300">
            <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition" aria-label="Home">
              <Home size={22} />
            </Link>
              <Link to="/search" className="hover:text-gray-900 dark:hover:text-white   transition" aria-label="Search">
              <Search size={22} />
            </Link>

            <button
              onClick={() => setShowCreate(true)}
              className="hover:text-gray-900 dark:hover:text-white transition"
              aria-label="Create post"
            >
              <PlusSquare size={22} />
            </button>

            <Link to="/rooms" className="hover:text-gray-900 dark:hover:text-white transition" aria-label="Echo Rooms">
              <MessageCircle size={22} />
            </Link>

            <NotificationBell />

            <button onClick={toggleTheme} className="hover:text-gray-900 dark:hover:text-white transition" aria-label="Toggle theme">
              {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            <Link to={`/profile/${username}`} aria-label="Your profile">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                {initial}
              </div>
            </Link>

            <Link to="/settings" className="hover:text-gray-900 dark:hover:text-white transition" aria-label="Settings">
              <SettingsIcon size={22} />
            </Link>
          </div>
        </div>
      </nav>

      {showCreate && username && (
        <CreatePostModal
          username={username}
          onClose={() => setShowCreate(false)}
          onCreated={() => navigate('/')}
        />
      )}
    </>
  );
}