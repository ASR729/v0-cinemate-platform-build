'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, X } from 'lucide-react'
import { PosterCard, PosterCardSkeleton } from '@/components/cinemate/PosterCard'
import { OnboardingData } from '@/lib/onboarding/store'
import { searchMovies, getPopularMovies, TMDbMovie } from '@/lib/tmdb/service'

interface Step3Props {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export function Step3Movies({ data, onUpdate, onNext, onBack }: Step3Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TMDbMovie[]>([])
  const [loading, setLoading] = useState(true)

  const loadInitial = useCallback(async () => {
    setLoading(true)
    const popular = await getPopularMovies()
    setResults(popular)
    setLoading(false)
  }, [])

  useEffect(() => { loadInitial() }, [loadInitial])

  useEffect(() => {
    if (!query.trim()) { loadInitial(); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      const found = await searchMovies(query)
      setResults(found)
      setLoading(false)
    }, 350)
    return () => clearTimeout(timer)
  }, [query, loadInitial])

  const toggleMovie = (movie: TMDbMovie) => {
    const isSelected = data.favoriteMovieIds.includes(movie.id)
    if (isSelected) {
      onUpdate({
        favoriteMovieIds: data.favoriteMovieIds.filter(id => id !== movie.id),
      })
    } else {
      onUpdate({
        favoriteMovieIds: [...data.favoriteMovieIds, movie.id],
        favoriteMovieTitles: { ...data.favoriteMovieTitles, [movie.id]: movie.title },
        favoriteMoviePosters: { ...data.favoriteMoviePosters, [movie.id]: movie.poster_path },
        favoriteMovieYears: { ...data.favoriteMovieYears, [movie.id]: movie.release_date?.slice(0, 4) || '' },
        favoriteMovieRatings: { ...data.favoriteMovieRatings, [movie.id]: movie.vote_average ?? 0 },
      })
    }
  }

  const selectedCount = data.favoriteMovieIds.length

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3 text-balance">
          Pick your favorite movies
        </h2>
        <p className="text-[#737373] text-base leading-relaxed">
          Search and select movies that define your cinematic taste.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="w-full bg-white/5 border border-white/10 focus:border-[#E50914]/60 text-white placeholder:text-[#404040] text-sm rounded-xl pl-11 pr-10 py-3.5 outline-none transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Selected collection strip */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className="text-[#a3a3a3] text-xs font-medium uppercase tracking-widest mb-3">
              Selected ({selectedCount})
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
              {data.favoriteMovieIds.map(id => (
                <PosterCard
                  key={`sel-${id}`}
                  id={id}
                  title={data.favoriteMovieTitles[id] || ''}
                  posterPath={data.favoriteMoviePosters[id] || null}
                  year={data.favoriteMovieYears[id]}
                  selected
                  onSelect={() => toggleMovie({
                    id,
                    title: data.favoriteMovieTitles[id] || '',
                    poster_path: data.favoriteMoviePosters[id] || null,
                    backdrop_path: null,
                    release_date: data.favoriteMovieYears[id] || '',
                    vote_average: 0,
                    overview: '',
                    genre_ids: [],
                  })}
                  size="sm"
                />
              ))}
            </div>
            <div className="mt-2 h-px bg-white/5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results grid */}
      <div className="flex flex-wrap gap-3 max-h-72 overflow-y-auto pb-2">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <PosterCardSkeleton key={i} />)
          : results.map(movie => (
              <PosterCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                year={movie.release_date?.slice(0, 4)}
                rating={movie.vote_average}
                genreIds={movie.genre_ids}
                mediaType="movie"
                selected={data.favoriteMovieIds.includes(movie.id)}
                onSelect={() => toggleMovie(movie)}
              />
            ))}
        {!loading && results.length === 0 && (
          <p className="text-[#737373] text-sm py-8 w-full text-center">
            No results found for &quot;{query}&quot;
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 glass border border-white/10 hover:border-white/20 text-[#a3a3a3] hover:text-white font-semibold text-base py-4 rounded-xl transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedCount === 0}
          className="flex-[2] bg-[#E50914] hover:bg-[#f40612] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-base py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#E50914]/25 flex items-center justify-center gap-2 group"
        >
          Continue
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.div>
  )
}
