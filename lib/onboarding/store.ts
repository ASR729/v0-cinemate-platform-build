export interface OnboardingData {
  displayName: string
  username: string
  genres: string[]
  favoriteMovieIds: number[]
  favoriteMovieTitles: Record<number, string>
  favoriteMoviePosters: Record<number, string | null>
  favoriteMovieYears: Record<number, string>
  favoriteMovieRatings: Record<number, number>
  favoriteSeriesIds: number[]
  favoriesSeriesTitles: Record<number, string>
  favoriteSeriesPosters: Record<number, string | null>
  favoriteSeriesYears: Record<number, string>
  favoriteSeriesRatings: Record<number, number>
  storytellingInterests: string[]
  emotionalPreferences: string[]
}

export const INITIAL_ONBOARDING_DATA: OnboardingData = {
  displayName: '',
  username: '',
  genres: [],
  favoriteMovieIds: [],
  favoriteMovieTitles: {},
  favoriteMoviePosters: {},
  favoriteMovieYears: {},
  favoriteMovieRatings: {},
  favoriteSeriesIds: [],
  favoriesSeriesTitles: {},
  favoriteSeriesPosters: {},
  favoriteSeriesYears: {},
  favoriteSeriesRatings: {},
  storytellingInterests: [],
  emotionalPreferences: [],
}

export const TOTAL_ONBOARDING_STEPS = 6

export const STEP_LABELS = [
  'Step 1 of 6 — Basic Profile',
  'Step 2 of 6 — Favorite Genres',
  'Step 3 of 6 — Favorite Movies',
  'Step 4 of 6 — Favorite Series',
  'Step 5 of 6 — Storytelling Interests',
  'Step 6 of 6 — Emotional Preferences',
]

export const GENRE_OPTIONS = [
  { id: 'action', label: 'Action' },
  { id: 'thriller', label: 'Thriller' },
  { id: 'scifi', label: 'Sci-Fi' },
  { id: 'mystery', label: 'Mystery' },
  { id: 'drama', label: 'Drama' },
  { id: 'romance', label: 'Romance' },
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'anime', label: 'Anime' },
  { id: 'documentary', label: 'Documentary' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'horror', label: 'Horror' },
  { id: 'crime', label: 'Crime' },
]

export const STORYTELLING_OPTIONS = [
  { id: 'plot_twists', label: 'Plot Twists' },
  { id: 'character_dev', label: 'Character Development' },
  { id: 'world_building', label: 'World Building' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'dark_themes', label: 'Dark Themes' },
  { id: 'mystery', label: 'Mystery' },
  { id: 'emotional', label: 'Emotional Stories' },
  { id: 'psychological', label: 'Psychological Narratives' },
  { id: 'scifi_concepts', label: 'Sci-Fi Concepts' },
  { id: 'historical', label: 'Historical Stories' },
]

export const EMOTIONAL_OPTIONS = [
  { id: 'inspirational', label: 'Inspirational' },
  { id: 'comforting', label: 'Comforting' },
  { id: 'thought_provoking', label: 'Thought Provoking' },
  { id: 'mind_bending', label: 'Mind Bending' },
  { id: 'emotional', label: 'Emotional' },
  { id: 'suspenseful', label: 'Suspenseful' },
  { id: 'intense', label: 'Intense' },
  { id: 'lighthearted', label: 'Lighthearted' },
]
