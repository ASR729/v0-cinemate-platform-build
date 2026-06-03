'use client'

import { TMDbItem } from '@/lib/firebase/firestore'
import React from 'react'

interface MovieCollectionProps {
  movies: TMDbItem[]
  maxDisplay?: number
}

export function MovieCollection({ movies, maxDisplay = 6 }: MovieCollectionProps) {
  if (movies.length === 0) {
    return null
  }

  const displayMovies = movies.slice(0, maxDisplay)

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-foreground mb-4">Favorite Movies</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayMovies.map((movie) => (
          <div
            key={movie.id}
            className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-surface-elevated border border-accent/20 hover:border-accent/50 transition-all"
          >
            {movie.posterPath ? (
              <>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </>
            ) : null}

            {/* Fallback / Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col items-end justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-center w-full">
                <p className="text-xs font-semibold text-white line-clamp-2">
                  {movie.title}
                </p>
                <p className="text-xs text-foreground-muted">{movie.releaseYear}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {movies.length > maxDisplay && (
        <p className="text-sm text-foreground-muted mt-4">
          +{movies.length - maxDisplay} more movies
        </p>
      )}
    </div>
  )
}
