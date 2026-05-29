'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Film,
  Tv,
  Heart,
  Edit2,
  Camera,
  MapPin,
  Calendar,
  Settings,
} from 'lucide-react'
import { Logo } from '@/components/cinemate/Logo'

// Mock user profile data (will connect to Firebase later)
const MOCK_USER = {
  displayName: 'CineMate User',
  username: 'cinemateuser',
  bio: 'Cinema lover. Horror enthusiast. Sci-fi dreamer.',
  location: 'Los Angeles, CA',
  joinedDate: 'January 2024',
  avatar: null,
  stats: {
    moviesWatched: 0,
    seriesWatched: 0,
    matchesFound: 0,
    listsCreated: 0,
  },
  favoriteGenres: ['Sci-Fi', 'Horror', 'Drama', 'Thriller'],
  topMovies: ['Interstellar', 'The Shining', 'Parasite'],
  topSeries: ['Breaking Bad', 'Stranger Things', 'The Last of Us'],
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: React.ElementType }) {
  return (
    <div className="glass rounded-xl p-4 border border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#E50914]/15 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#E50914]" />
        </div>
        <div>
          <p className="text-white font-bold text-lg">{value}</p>
          <p className="text-[#737373] text-xs">{label}</p>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [user] = useState(MOCK_USER)

  return (
    <div className="px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative glass rounded-2xl p-6 md:p-8 border border-white/5 overflow-hidden mb-8"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#E50914]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-[#E50914]/20 border border-[#E50914]/30 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <span className="text-[#E50914] text-3xl font-bold font-serif">
                    {user.displayName.charAt(0)}
                  </span>
                )}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center text-[#737373] hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-white font-bold text-2xl">{user.displayName}</h1>
                <button className="text-[#737373] hover:text-white transition-colors p-1">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[#737373] text-sm mb-3">@{user.username}</p>
              <p className="text-[#a3a3a3] text-sm mb-4 max-w-md">{user.bio}</p>
              <div className="flex flex-wrap items-center gap-4 text-[#737373] text-xs">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {user.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {user.joinedDate}
                </span>
              </div>
            </div>

            {/* Settings button */}
            <button className="absolute top-0 right-0 md:static glass border border-white/10 hover:border-white/20 text-[#737373] hover:text-white p-2.5 rounded-lg transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        <StatCard icon={Film} label="Movies Watched" value={user.stats.moviesWatched} />
        <StatCard icon={Tv} label="Series Watched" value={user.stats.seriesWatched} />
        <StatCard icon={Heart} label="Matches Found" value={user.stats.matchesFound} />
        <StatCard icon={User} label="Lists Created" value={user.stats.listsCreated} />
      </motion.div>

      {/* Favorite Genres */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="glass rounded-xl p-5 border border-white/5 mb-6"
      >
        <h3 className="text-[#a3a3a3] text-sm font-medium mb-4 uppercase tracking-widest">Favorite Genres</h3>
        <div className="flex flex-wrap gap-2">
          {user.favoriteGenres.map((genre) => (
            <span
              key={genre}
              className="px-3 py-1.5 rounded-lg bg-[#E50914]/15 border border-[#E50914]/20 text-[#E50914] text-sm"
            >
              {genre}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Top Movies & Series */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="glass rounded-xl p-5 border border-white/5"
        >
          <h3 className="text-[#a3a3a3] text-sm font-medium mb-4 uppercase tracking-widest flex items-center gap-2">
            <Film className="w-4 h-4 text-[#E50914]" />
            Top Movies
          </h3>
          <ul className="space-y-3">
            {user.topMovies.map((movie, i) => (
              <li key={movie} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-[#E50914]/10 text-[#E50914] text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-white text-sm">{movie}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="glass rounded-xl p-5 border border-white/5"
        >
          <h3 className="text-[#a3a3a3] text-sm font-medium mb-4 uppercase tracking-widest flex items-center gap-2">
            <Tv className="w-4 h-4 text-[#E50914]" />
            Top Series
          </h3>
          <ul className="space-y-3">
            {user.topSeries.map((series, i) => (
              <li key={series} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-[#E50914]/10 text-[#E50914] text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-white text-sm">{series}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
