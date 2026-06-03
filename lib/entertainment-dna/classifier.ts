import { UserProfile } from '@/lib/firebase/firestore'

export type EntertainmentDNAType =
  | 'The Visionary'
  | 'The Explorer'
  | 'The Strategist'
  | 'The Story Seeker'
  | 'The Dreamer'
  | 'The Analyst'
  | 'The Philosopher'
  | 'The Adventurer'

export interface EntertainmentDNA {
  type: EntertainmentDNAType
  confidence: number // 0-100
  description: string
}

// DNA Type Descriptions
const DNA_DESCRIPTIONS: Record<EntertainmentDNAType, string> = {
  'The Visionary':
    'You seek mind-bending narratives that challenge reality and explore philosophical depths.',
  'The Explorer':
    'You crave dynamic storytelling with action, adventure, and diverse emotional landscapes.',
  'The Strategist':
    'You love intricate plots, mysterious twists, and psychological depth in your entertainment.',
  'The Story Seeker':
    'You connect deeply with character-driven narratives and emotional storytelling.',
  'The Dreamer':
    'You escape into magical worlds filled with fantasy, romance, and inspirational tales.',
  'The Analyst':
    'You prefer documentary-style content with true crime, mystery, and thought-provoking subjects.',
  'The Philosopher':
    'You engage with complex, layered narratives that explore human nature and ethics.',
  'The Adventurer':
    'You embrace action-packed narratives across multiple genres with emphasis on excitement and novelty.',
}

// Archetype mappings for scoring
interface ArchetypeScores {
  visionary: number
  explorer: number
  strategist: number
  seeker: number
  dreamer: number
  analyst: number
  philosopher: number
  adventurer: number
}

export function classifyEntertainmentDNA(profile: UserProfile): EntertainmentDNA {
  const scores: ArchetypeScores = {
    visionary: 0,
    explorer: 0,
    strategist: 0,
    seeker: 0,
    dreamer: 0,
    analyst: 0,
    philosopher: 0,
    adventurer: 0,
  }

  // Genre scoring
  const genreScores = scoreGenres(profile.genres)
  scores.visionary += genreScores.visionary
  scores.explorer += genreScores.explorer
  scores.strategist += genreScores.strategist
  scores.seeker += genreScores.seeker
  scores.dreamer += genreScores.dreamer
  scores.analyst += genreScores.analyst
  scores.philosopher += genreScores.philosopher
  scores.adventurer += genreScores.adventurer

  // Storytelling scoring
  const storytellingScores = scoreStorytelling(profile.storytellingInterests)
  scores.visionary += storytellingScores.visionary
  scores.explorer += storytellingScores.explorer
  scores.strategist += storytellingScores.strategist
  scores.seeker += storytellingScores.seeker
  scores.dreamer += storytellingScores.dreamer
  scores.analyst += storytellingScores.analyst
  scores.philosopher += storytellingScores.philosopher
  scores.adventurer += storytellingScores.adventurer

  // Emotional preferences scoring
  const emotionalScores = scoreEmotional(profile.emotionalPreferences)
  scores.visionary += emotionalScores.visionary
  scores.explorer += emotionalScores.explorer
  scores.strategist += emotionalScores.strategist
  scores.seeker += emotionalScores.seeker
  scores.dreamer += emotionalScores.dreamer
  scores.analyst += emotionalScores.analyst
  scores.philosopher += emotionalScores.philosopher
  scores.adventurer += emotionalScores.adventurer

  // Movie-based scoring
  const movieScores = scoreMovies(profile.favoriteMovies)
  scores.visionary += movieScores.visionary
  scores.explorer += movieScores.explorer
  scores.strategist += movieScores.strategist
  scores.seeker += movieScores.seeker
  scores.dreamer += movieScores.dreamer
  scores.analyst += movieScores.analyst
  scores.philosopher += movieScores.philosopher
  scores.adventurer += movieScores.adventurer

  // Find the highest score
  const entries = Object.entries(scores)
  const maxScore = Math.max(...entries.map(([, v]) => v))
  const maxKey = entries.find(([, v]) => v === maxScore)?.[0]

  // Calculate confidence (percentage of max compared to total)
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
  const confidence = totalScore > 0 ? Math.round((maxScore / totalScore) * 100) : 0

  // Map to DNA type
  const typeMap: Record<string, EntertainmentDNAType> = {
    visionary: 'The Visionary',
    explorer: 'The Explorer',
    strategist: 'The Strategist',
    seeker: 'The Story Seeker',
    dreamer: 'The Dreamer',
    analyst: 'The Analyst',
    philosopher: 'The Philosopher',
    adventurer: 'The Adventurer',
  }

  const type = typeMap[maxKey || 'adventurer']

  return {
    type,
    confidence,
    description: DNA_DESCRIPTIONS[type],
  }
}

function scoreGenres(genres: string[]): ArchetypeScores {
  const scores: ArchetypeScores = {
    visionary: 0,
    explorer: 0,
    strategist: 0,
    seeker: 0,
    dreamer: 0,
    analyst: 0,
    philosopher: 0,
    adventurer: 0,
  }

  const genreMap: Record<string, (scores: ArchetypeScores) => void> = {
    scifi: (s) => {
      s.visionary += 3
      s.explorer += 1
      s.philosopher += 1
    },
    thriller: (s) => {
      s.strategist += 3
      s.philosopher += 1
      s.analyst += 1
    },
    mystery: (s) => {
      s.strategist += 2
      s.analyst += 2
      s.philosopher += 1
    },
    drama: (s) => {
      s.seeker += 3
      s.explorer += 1
      s.philosopher += 1
    },
    romance: (s) => {
      s.dreamer += 3
      s.seeker += 1
    },
    fantasy: (s) => {
      s.dreamer += 2
      s.explorer += 2
      s.adventurer += 1
    },
    action: (s) => {
      s.explorer += 2
      s.adventurer += 2
      s.strategist += 1
    },
    crime: (s) => {
      s.analyst += 2
      s.strategist += 2
      s.philosopher += 1
    },
    documentary: (s) => {
      s.analyst += 3
      s.philosopher += 1
    },
    comedy: (s) => {
      s.explorer += 2
      s.adventurer += 1
      s.dreamer += 1
    },
    horror: (s) => {
      s.strategist += 1
      s.philosopher += 1
      s.adventurer += 1
    },
    anime: (s) => {
      s.explorer += 2
      s.adventurer += 1
      s.dreamer += 1
    },
  }

  genres.forEach((genre) => {
    const scorer = genreMap[genre.toLowerCase()]
    if (scorer) scorer(scores)
  })

  return scores
}

function scoreStorytelling(storytellingInterests: string[]): ArchetypeScores {
  const scores: ArchetypeScores = {
    visionary: 0,
    explorer: 0,
    strategist: 0,
    seeker: 0,
    dreamer: 0,
    analyst: 0,
    philosopher: 0,
    adventurer: 0,
  }

  const storytellingMap: Record<string, (scores: ArchetypeScores) => void> = {
    plot_twists: (s) => {
      s.strategist += 2
      s.visionary += 1
    },
    character_dev: (s) => {
      s.seeker += 3
      s.philosopher += 1
    },
    world_building: (s) => {
      s.dreamer += 2
      s.explorer += 2
      s.adventurer += 1
    },
    philosophy: (s) => {
      s.philosopher += 3
      s.visionary += 1
    },
    dark_themes: (s) => {
      s.philosopher += 2
      s.strategist += 1
    },
    mystery: (s) => {
      s.strategist += 2
      s.analyst += 2
    },
    emotional: (s) => {
      s.seeker += 3
      s.dreamer += 1
    },
    psychological: (s) => {
      s.visionary += 2
      s.philosopher += 2
      s.strategist += 1
    },
    scifi_concepts: (s) => {
      s.visionary += 3
      s.explorer += 1
    },
    historical: (s) => {
      s.analyst += 2
      s.philosopher += 1
    },
  }

  storytellingInterests.forEach((interest) => {
    const scorer = storytellingMap[interest.toLowerCase()]
    if (scorer) scorer(scores)
  })

  return scores
}

function scoreEmotional(emotionalPreferences: string[]): ArchetypeScores {
  const scores: ArchetypeScores = {
    visionary: 0,
    explorer: 0,
    strategist: 0,
    seeker: 0,
    dreamer: 0,
    analyst: 0,
    philosopher: 0,
    adventurer: 0,
  }

  const emotionalMap: Record<string, (scores: ArchetypeScores) => void> = {
    inspirational: (s) => {
      s.dreamer += 2
      s.seeker += 1
    },
    comforting: (s) => {
      s.dreamer += 2
      s.seeker += 1
    },
    thought_provoking: (s) => {
      s.philosopher += 2
      s.visionary += 1
    },
    mind_bending: (s) => {
      s.visionary += 3
      s.philosopher += 1
    },
    emotional: (s) => {
      s.seeker += 3
      s.dreamer += 1
    },
    suspenseful: (s) => {
      s.strategist += 2
      s.analyst += 1
    },
    intense: (s) => {
      s.adventurer += 2
      s.explorer += 1
    },
    lighthearted: (s) => {
      s.dreamer += 2
      s.explorer += 1
    },
  }

  emotionalPreferences.forEach((pref) => {
    const scorer = emotionalMap[pref.toLowerCase()]
    if (scorer) scorer(scores)
  })

  return scores
}

function scoreMovies(
  favoriteMovies: Array<{ title: string; releaseYear: string; rating: number }>
): ArchetypeScores {
  const scores: ArchetypeScores = {
    visionary: 0,
    explorer: 0,
    strategist: 0,
    seeker: 0,
    dreamer: 0,
    analyst: 0,
    philosopher: 0,
    adventurer: 0,
  }

  // Popular movies mapped to archetypes
  const movieMap: Record<string, (scores: ArchetypeScores) => void> = {
    interstellar: (s) => {
      s.visionary += 3
    },
    inception: (s) => {
      s.visionary += 3
      s.philosopher += 1
    },
    'dark knight': (s) => {
      s.strategist += 2
      s.philosopher += 1
    },
    'dark knight rises': (s) => {
      s.strategist += 2
      s.philosopher += 1
    },
    'breaking bad': (s) => {
      s.philosopher += 2
      s.strategist += 1
    },
    'stranger things': (s) => {
      s.explorer += 2
      s.visionary += 1
    },
    'game of thrones': (s) => {
      s.philosopher += 2
      s.strategist += 1
    },
    shawshank: (s) => {
      s.seeker += 2
    },
    titanic: (s) => {
      s.dreamer += 2
      s.seeker += 1
    },
    avatar: (s) => {
      s.explorer += 2
      s.adventurer += 1
    },
    pulpfiction: (s) => {
      s.strategist += 2
      s.philosopher += 1
    },
    godfather: (s) => {
      s.philosopher += 2
      s.seeker += 1
    },
    matrix: (s) => {
      s.visionary += 2
      s.philosopher += 1
    },
    avengers: (s) => {
      s.adventurer += 2
      s.explorer += 1
    },
    starwars: (s) => {
      s.adventurer += 2
      s.dreamer += 1
    },
    'lord of the rings': (s) => {
      s.dreamer += 2
      s.explorer += 1
    },
    conjuring: (s) => {
      s.strategist += 1
      s.adventurer += 1
    },
  }

  favoriteMovies.forEach((movie) => {
    const titleLower = movie.title.toLowerCase().replace(/\s+/g, '')
    const scorer = movieMap[titleLower]
    if (scorer) scorer(scores)
  })

  return scores
}
