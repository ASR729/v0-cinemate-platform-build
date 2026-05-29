'use client'

import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getPosterUrl } from '@/lib/tmdb/service'

interface PosterCardProps {
  id: number
  title: string
  posterPath: string | null
  year?: string
  rating?: number
  selected?: boolean
  onSelect?: (id: number) => void
  size?: 'sm' | 'md' | 'lg'
}

// Cinematic placeholder colors for when no poster is available
const PLACEHOLDER_COLORS = [
  'from-slate-800 to-slate-900',
  'from-zinc-800 to-zinc-900',
  'from-neutral-800 to-neutral-900',
  'from-stone-800 to-stone-900',
  'from-red-950 to-slate-900',
  'from-blue-950 to-slate-900',
]

function getPosterPlaceholder(id: number) {
  return PLACEHOLDER_COLORS[id % PLACEHOLDER_COLORS.length]
}

export function PosterCard({
  id,
  title,
  posterPath,
  year,
  rating,
  selected = false,
  onSelect,
  size = 'md',
}: PosterCardProps) {
  const sizeClasses = {
    sm: 'w-24 h-36',
    md: 'w-32 h-48 md:w-36 md:h-52',
    lg: 'w-40 h-60 md:w-44 md:h-64',
  }

  const posterUrl = getPosterUrl(posterPath, 'w342')

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'relative rounded-lg overflow-hidden cursor-pointer flex-shrink-0',
        sizeClasses[size],
        selected && 'ring-2 ring-[#E50914] ring-offset-2 ring-offset-black',
        'poster-glow transition-shadow duration-300'
      )}
      onClick={() => onSelect?.(id)}
      role="button"
      aria-pressed={selected}
      aria-label={`${selected ? 'Deselect' : 'Select'} ${title}`}
    >
      {/* Poster image or placeholder */}
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={`${title} poster`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className={cn('w-full h-full bg-gradient-to-b flex items-end p-2', getPosterPlaceholder(id))}>
          <p className="text-white text-xs font-medium leading-tight line-clamp-3">{title}</p>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-2">
        {!posterUrl && year && (
          <p className="text-[#a3a3a3] text-[10px]">{year}</p>
        )}
        {rating && (
          <div className="flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-[10px]">{rating.toFixed(1)}</span>
          </div>
        )}
        {posterUrl && (
          <p className="text-white text-[10px] font-medium leading-tight line-clamp-2 mt-0.5">{title}</p>
        )}
      </div>

      {/* Selected checkmark */}
      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#E50914] flex items-center justify-center shadow-lg"
        >
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </motion.div>
      )}

      {/* Hover overlay */}
      {!selected && (
        <div className="absolute inset-0 bg-[#E50914]/0 hover:bg-[#E50914]/10 transition-colors duration-200" />
      )}
    </motion.div>
  )
}

// Skeleton version
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
