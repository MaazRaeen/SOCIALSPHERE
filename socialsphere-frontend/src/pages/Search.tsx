import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { searchUsers } from '../api/userApi';
import type { User } from '../types';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchUsers(query.trim())
        .then(setResults)
        .finally(() => setSearching(false));
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Search</h1>

      <div className="relative mb-6">
        <SearchIcon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          autoFocus
          placeholder="Search accounts..."
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            if (!value.trim()) {
              setResults([]);
              setSearching(false);
            } else {
              setSearching(true);
            }
          }}
          className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {searching && <p className="text-gray-500 text-sm text-center">Searching...</p>}

      {!searching && query.trim() && results.length === 0 && (
        <p className="text-gray-500 text-sm text-center">No accounts found for "{query}"</p>
      )}

      <div className="space-y-1">
        {results.map((user) => {
          const initial = user.username.charAt(0).toUpperCase();
          return (
            <Link
              key={user.id}
              to={`/profile/${user.username}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/60 transition"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white flex-shrink-0 overflow-hidden">
                {user.profilePictureUrl ? (
                  <img src={user.profilePictureUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  initial
                )}
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-semibold text-sm">{user.username}</p>
                {user.bio && (
                  <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-1">{user.bio}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}