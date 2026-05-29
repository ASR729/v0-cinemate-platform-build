export interface TMDbMovie {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  overview: string
  genre_ids: number[]
}

export interface TMDbSeries {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  overview: string
  genre_ids: number[]
}

export interface TMDbSearchResult<T> {
  results: T[]
  total_results: number
  total_pages: number
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

const isMock = !TMDB_API_KEY

// Mock data for development
const MOCK_MOVIES: TMDbMovie[] = [
  { id: 1, title: 'Inception', poster_path: null, backdrop_path: null, release_date: '2010-07-16', vote_average: 8.8, overview: 'A thief who enters the dreams of others.', genre_ids: [28, 878] },
  { id: 2, title: 'Interstellar', poster_path: null, backdrop_path: null, release_date: '2014-11-05', vote_average: 8.6, overview: 'A team of explorers travel through a wormhole.', genre_ids: [18, 878] },
  { id: 3, title: 'The Dark Knight', poster_path: null, backdrop_path: null, release_date: '2008-07-18', vote_average: 9.0, overview: 'Batman faces the Joker.', genre_ids: [28, 80, 18] },
  { id: 4, title: 'Parasite', poster_path: null, backdrop_path: null, release_date: '2019-05-30', vote_average: 8.5, overview: 'Class discrimination themes.', genre_ids: [35, 53, 18] },
  { id: 5, title: 'Everything Everywhere All at Once', poster_path: null, backdrop_path: null, release_date: '2022-03-25', vote_average: 8.0, overview: 'A middle-aged Chinese woman discovers she is connected to other universes.', genre_ids: [28, 12, 35] },
  { id: 6, title: 'The Shawshank Redemption', poster_path: null, backdrop_path: null, release_date: '1994-09-23', vote_average: 9.3, overview: 'Two imprisoned men bond over a number of years.', genre_ids: [18] },
  { id: 7, title: 'Dune', poster_path: null, backdrop_path: null, release_date: '2021-09-15', vote_average: 7.9, overview: 'A noble family becomes embroiled in a war for control over a desert planet.', genre_ids: [878, 12] },
  { id: 8, title: 'Oppenheimer', poster_path: null, backdrop_path: null, release_date: '2023-07-21', vote_average: 8.3, overview: 'The story of J. Robert Oppenheimer\'s role in the development of the atomic bomb.', genre_ids: [18, 36] },
  { id: 9, title: 'Whiplash', poster_path: null, backdrop_path: null, release_date: '2014-10-10', vote_average: 8.5, overview: 'A promising young drummer enrolls at a cutthroat music conservatory.', genre_ids: [18, 10402] },
  { id: 10, title: 'La La Land', poster_path: null, backdrop_path: null, release_date: '2016-12-09', vote_average: 8.0, overview: 'A jazz musician and an actress fall in love in Los Angeles.', genre_ids: [35, 18, 10402] },
]

const MOCK_SERIES: TMDbSeries[] = [
  { id: 101, name: 'Breaking Bad', poster_path: null, backdrop_path: null, first_air_date: '2008-01-20', vote_average: 9.5, overview: 'A high school chemistry teacher turned drug lord.', genre_ids: [18, 80] },
  { id: 102, name: 'Stranger Things', poster_path: null, backdrop_path: null, first_air_date: '2016-07-15', vote_average: 8.7, overview: 'Supernatural events unfold in a small town.', genre_ids: [18, 9648, 10765] },
  { id: 103, name: 'Game of Thrones', poster_path: null, backdrop_path: null, first_air_date: '2011-04-17', vote_average: 8.4, overview: 'Noble families fight for control of the Iron Throne.', genre_ids: [18, 10759, 10765] },
  { id: 104, name: 'Dark', poster_path: null, backdrop_path: null, first_air_date: '2017-12-01', vote_average: 8.8, overview: 'A family saga with time travel elements in a German town.', genre_ids: [80, 18, 9648] },
  { id: 105, name: 'Severance', poster_path: null, backdrop_path: null, first_air_date: '2022-02-18', vote_average: 8.7, overview: 'Workers who have undergone a procedure to separate work memories.', genre_ids: [18, 878, 9648] },
  { id: 106, name: 'The Bear', poster_path: null, backdrop_path: null, first_air_date: '2022-06-23', vote_average: 8.6, overview: 'A young chef returns to Chicago to run his family sandwich shop.', genre_ids: [18, 35] },
  { id: 107, name: 'Succession', poster_path: null, backdrop_path: null, first_air_date: '2018-06-03', vote_average: 8.8, overview: 'A dysfunctional family fights for control of their media empire.', genre_ids: [18] },
  { id: 108, name: 'Black Mirror', poster_path: null, backdrop_path: null, first_air_date: '2011-12-04', vote_average: 8.2, overview: 'Anthology series exploring dark technology themes.', genre_ids: [18, 878] },
  { id: 109, name: 'Ozark', poster_path: null, backdrop_path: null, first_air_date: '2017-07-21', vote_average: 8.4, overview: 'A financial planner relocates his family to the Missouri Ozarks.', genre_ids: [80, 18, 53] },
  { id: 110, name: 'Wednesday', poster_path: null, backdrop_path: null, first_air_date: '2022-11-23', vote_average: 8.1, overview: 'Wednesday Addams attends Nevermore Academy.', genre_ids: [35, 9648, 10765] },
]

async function tmdbFetch<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}${endpoint}&api_key=${TMDB_API_KEY}`,
      { next: { revalidate: 3600 } }
    )
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

export const searchMovies = async (query: string): Promise<TMDbMovie[]> => {
  if (isMock) {
    if (!query) return MOCK_MOVIES
    const q = query.toLowerCase()
    return MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(q))
  }

  const data = await tmdbFetch<TMDbSearchResult<TMDbMovie>>(
    `/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`
  )
  return data?.results || []
}

export const searchSeries = async (query: string): Promise<TMDbSeries[]> => {
  if (isMock) {
    if (!query) return MOCK_SERIES
    const q = query.toLowerCase()
    return MOCK_SERIES.filter(s => s.name.toLowerCase().includes(q))
  }

  const data = await tmdbFetch<TMDbSearchResult<TMDbSeries>>(
    `/search/tv?query=${encodeURIComponent(query)}&language=en-US&page=1`
  )
  return data?.results || []
}

export const getPopularMovies = async (): Promise<TMDbMovie[]> => {
  if (isMock) return MOCK_MOVIES

  const data = await tmdbFetch<TMDbSearchResult<TMDbMovie>>(
    `/movie/popular?language=en-US&page=1`
  )
  return data?.results?.slice(0, 12) || []
}

export const getPopularSeries = async (): Promise<TMDbSeries[]> => {
  if (isMock) return MOCK_SERIES

  const data = await tmdbFetch<TMDbSearchResult<TMDbSeries>>(
    `/tv/popular?language=en-US&page=1`
  )
  return data?.results?.slice(0, 12) || []
}

export const getPosterUrl = (path: string | null, size: 'w185' | 'w342' | 'w500' | 'original' = 'w342'): string => {
  if (!path) return ''
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export const getBackdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280'): string => {
  if (!path) return ''
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}
