import { UserProfile } from '@/lib/firebase/firestore'

export interface CompatibilityScore {
  score: number // 0-100
  sharedGenres: string[]
  sharedGenresPercent: number
  sharedMoviesCount: number
  sharedMoviesPercent: number
  sharedSeriesCount: number
  sharedSeriesPercent: number
  sharedStorytelling: string[]
  sharedStorytellingPercent: number
  sharedEmotional: string[]
  sharedEmotionalPercent: number
  explanation: string
}

export function calculateCompatibility(
  user1: UserProfile,
  user2: UserProfile
): CompatibilityScore {
  // Calculate shared items
  const sharedGenres = calculateSharedGenres(user1.genres, user2.genres)
  const sharedGenresPercent = calculatePercent(
    sharedGenres.length,
    Math.max(user1.genres.length, user2.genres.length, 1)
  )

  const sharedMovies = calculateSharedMovies(user1.favoriteMovies, user2.favoriteMovies)
  const sharedMoviesPercent = calculatePercent(
    sharedMovies,
    Math.max(user1.favoriteMovies.length, user2.favoriteMovies.length, 1)
  )

  const sharedSeries = calculateSharedSeries(user1.favoriteSeries, user2.favoriteSeries)
  const sharedSeriesPercent = calculatePercent(
    sharedSeries,
    Math.max(user1.favoriteSeries.length, user2.favoriteSeries.length, 1)
  )

  const sharedStorytelling = calculateSharedStorytelling(
    user1.storytellingInterests,
    user2.storytellingInterests
  )
  const sharedStorytellingPercent = calculatePercent(
    sharedStorytelling.length,
    Math.max(user1.storytellingInterests.length, user2.storytellingInterests.length, 1)
  )

  const sharedEmotional = calculateSharedEmotional(
    user1.emotionalPreferences,
    user2.emotionalPreferences
  )
  const sharedEmotionalPercent = calculatePercent(
    sharedEmotional.length,
    Math.max(user1.emotionalPreferences.length, user2.emotionalPreferences.length, 1)
  )

  // Calculate weighted score
  const score = Math.round(
    sharedGenresPercent * 0.3 +
      sharedMoviesPercent * 0.3 +
      sharedSeriesPercent * 0.2 +
      sharedStorytellingPercent * 0.1 +
      sharedEmotionalPercent * 0.1
  )

  const explanation = generateExplanation(
    sharedGenres,
    sharedMovies,
    sharedSeries,
    sharedStorytelling,
    sharedEmotional,
    score
  )

  return {
    score,
    sharedGenres,
    sharedGenresPercent,
    sharedMoviesCount: sharedMovies,
    sharedMoviesPercent,
    sharedSeriesCount: sharedSeries,
    sharedSeriesPercent,
    sharedStorytelling,
    sharedStorytellingPercent,
    sharedEmotional,
    sharedEmotionalPercent,
    explanation,
  }
}

function calculateSharedGenres(genres1: string[], genres2: string[]): string[] {
  const set1 = new Set(genres1.map((g) => g.toLowerCase()))
  return genres2.filter((g) => set1.has(g.toLowerCase()))
}

function calculateSharedMovies(
  movies1: Array<{ id: number; title: string }>,
  movies2: Array<{ id: number; title: string }>
): number {
  const set1 = new Set(movies1.map((m) => m.id))
  return movies2.filter((m) => set1.has(m.id)).length
}

function calculateSharedSeries(
  series1: Array<{ id: number; title: string }>,
  series2: Array<{ id: number; title: string }>
): number {
  const set1 = new Set(series1.map((s) => s.id))
  return series2.filter((s) => set1.has(s.id)).length
}

function calculateSharedStorytelling(storytelling1: string[], storytelling2: string[]): string[] {
  const set1 = new Set(storytelling1.map((s) => s.toLowerCase()))
  return storytelling2.filter((s) => set1.has(s.toLowerCase()))
}

function calculateSharedEmotional(emotional1: string[], emotional2: string[]): string[] {
  const set1 = new Set(emotional1.map((e) => e.toLowerCase()))
  return emotional2.filter((e) => set1.has(e.toLowerCase()))
}

function calculatePercent(shared: number, total: number): number {
  return total > 0 ? Math.round((shared / total) * 100) : 0
}

function generateExplanation(
  sharedGenres: string[],
  sharedMovies: number,
  sharedSeries: number,
  sharedStorytelling: string[],
  sharedEmotional: string[],
  score: number
): string {
  const parts: string[] = []

  if (score >= 80) {
    parts.push(`You and this person are highly compatible entertainment matches!`)
  } else if (score >= 60) {
    parts.push(`You two share strong entertainment tastes with several key interests in common.`)
  } else if (score >= 40) {
    parts.push(`You share some entertainment interests, with room for discovery together.`)
  } else {
    parts.push(`You have some different entertainment preferences, but could find common ground.`)
  }

  // Add specific details
  const details: string[] = []

  if (sharedGenres.length > 0) {
    const genreList = sharedGenres.slice(0, 2).join(', ')
    details.push(`both love ${genreList}`)
  }

  if (sharedMovies > 0) {
    details.push(`have ${sharedMovies} favorite movie${sharedMovies !== 1 ? 's' : ''} in common`)
  }

  if (sharedSeries > 0) {
    details.push(`enjoy ${sharedSeries} favorite series${sharedSeries !== 1 ? '' : ''}`)
  }

  if (sharedStorytelling.length > 0 || sharedEmotional.length > 0) {
    details.push(`share similar storytelling preferences`)
  }

  if (details.length > 0) {
    parts.push(`You ${details.slice(0, 2).join(' and ')}.`)
  }

  return parts.join(' ')
}
