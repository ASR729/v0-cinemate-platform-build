'use client'

interface GenresDisplayProps {
  genres: string[]
}

export function GenresDisplay({ genres }: GenresDisplayProps) {
  if (genres.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-foreground mb-4">Favorite Genres</h3>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <div
            key={genre}
            className="px-4 py-2 bg-surface-elevated border border-accent/20 rounded-full text-sm font-medium text-foreground-muted hover:text-accent hover:border-accent/50 transition-colors"
          >
            {genre}
          </div>
        ))}
      </div>
    </div>
  )
}
