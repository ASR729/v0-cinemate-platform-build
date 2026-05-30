'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Film } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getPosterUrl, getGenreNames } from '@/lib/tmdb/service'

interface PosterCardProps {
  id: number
  title: string
  posterPath: string | null
  year?: string
  rating?: number
  genreIds?: number[]
  mediaType?: 'movie' | 'tv'
  selected?: boolean
  onSelect?: (id: number) => void
  size?: 'sm' | 'md' | 'lg'
}

const PLACEHOLDER_GRADIENTS = [
  ['#1a1a2e', '#16213e'],
  ['#0f0f23', '#1a0a2e'],
  ['#1a0a0a', '#2e1010'],
  ['#0a1a0a', '#102e10'],
  ['#1a150a', '#2e250a'],
  ['#0a1a1a', '#0a2e2e'],
]

function getPlaceholderGradient(id: number) {
  return PLACEHOLDER_GRADIENTS[Math.abs(id) % PLACEHOLDER_GRADIENTS.length]
}

export function PosterCard({
  id,
  title,
  posterPath,
  year,
  rating,
  genreIds = [],
  mediaType = 'movie',
  selected = false,
  onSelect,
  size = 'md',
}: PosterCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: 'w-24 h-36',
    md: 'w-32 h-48 md:w-36 md:h-52',
    lg: 'w-40 h-60 md:w-44 md:h-64',
  }

  const posterUrl = getPosterUrl(posterPath, 'w342')
  const hasValidPoster = !!posterUrl && !imageError
  const genres = genreIds.length > 0 ? getGenreNames(genreIds, mediaType) : []
  const [color1, color2] = getPlaceholderGradient(id)

  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -6 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className={cn(
        'relative rounded-lg overflow-hidden cursor-pointer flex-shrink-0 group',
        sizeClasses[size],
        selected
          ? 'ring-2 ring-[#E50914] ring-offset-2 ring-offset-black'
          : 'ring-1 ring-white/5 hover:ring-white/20',
      )}
      onClick={() => onSelect?.(id)}
      role="button"
      aria-pressed={selected}
      aria-label={`${selected ? 'Deselect' : 'Select'} ${title}`}
    >
      {/* Placeholder — always present underneath the poster */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3"
        style={{ background: `linear-gradient(160deg, ${color1}, ${color2})` }}
      >
        <Film className="w-8 h-8 text-white/20" />
        <p className="text-white/40 text-[10px] font-medium text-center leading-tight line-clamp-3">
          {title}
        </p>
      </div>

      {/* Shimmer while the poster is loading */}
      {hasValidPoster && !imageLoaded && (
        <div className="absolute inset-0 skeleton" />
      )}

      {/* Actual poster image */}
      {hasValidPoster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterUrl}
          alt={`${title} poster`}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
            imageLoaded ? 'opacity-100' : 'opacity-0',
          )}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}

      {/* Gradient overlay for legible text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Bottom metadata */}
      <div className="absolute bottom-0 left-0 right-0 p-2 space-y-1">
        {/* Genre badge — shown on md/lg only */}
        {genres.length > 0 && size !== 'sm' && (
          <span className="inline-block text-[8px] font-semibold uppercase tracking-wide bg-white/10 backdrop-blur-sm text-white/80 px-1.5 py-0.5 rounded">
            {genres[0]}
          </span>
        )}

        {/* Title */}
        <p className="text-white text-[10px] font-semibold leading-tight line-clamp-2">
          {title}
        </p>

        {/* Year + Rating */}
        <div className="flex items-center gap-1">
          {year && (
            <span className="text-[#a3a3a3] text-[9px] font-medium">{year}</span>
          )}
          {rating != null && rating > 0 && (
            <div className="flex items-center gap-0.5 ml-auto">
              <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-[9px] font-bold">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected checkmark */}
      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#E50914] flex items-center justify-center shadow-lg shadow-black/60"
        >
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </motion.div>
      )}

      {/* Subtle red tint on hover */}
      <div className="absolute inset-0 bg-[#E50914]/0 group-hover:bg-[#E50914]/8 transition-colors duration-200 pointer-events-none" />
    </motion.div>
  )
}

// Skeleton placeholder while data loads
export function PosterCardSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-24 h-36',
    md: 'w-32 h-48 md:w-36 md:h-52',
    lg: 'w-40 h-60 md:w-44 md:h-64',
  }
  return (
    <div className={cn('rounded-lg skeleton flex-shrink-0', sizeClasses[size])} />
  )
}
