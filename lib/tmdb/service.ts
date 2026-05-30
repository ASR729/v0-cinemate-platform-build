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

// TMDb Genre IDs to names mapping
export const MOVIE_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
}

export const TV_GENRES: Record<number, string> = {
  10759: 'Action & Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  10762: 'Kids',
  9648: 'Mystery',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
  37: 'Western',
}

// Get genre names from IDs
export function getGenreNames(genreIds: number[], type: 'movie' | 'tv' = 'movie'): string[] {
  const genreMap = type === 'movie' ? MOVIE_GENRES : TV_GENRES
  return genreIds
    .map(id => genreMap[id])
    .filter(Boolean)
    .slice(0, 2) // Return max 2 genres
}

// Mock data with real TMDb poster paths for popular movies
const MOCK_MOVIES: TMDbMovie[] = [
  { id: 157336, title: 'Interstellar', poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', backdrop_path: '/xJHokMbljvjADYdit5fK5VQsXEG.jpg', release_date: '2014-11-05', vote_average: 8.4, overview: 'A team of explorers travel through a wormhole.', genre_ids: [12, 18, 878] },
  { id: 27205, title: 'Inception', poster_path: '/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg', backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg', release_date: '2010-07-16', vote_average: 8.4, overview: 'A thief who enters the dreams of others.', genre_ids: [28, 878, 12] },
  { id: 155, title: 'The Dark Knight', poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', backdrop_path: '/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg', release_date: '2008-07-18', vote_average: 9.0, overview: 'Batman faces the Joker.', genre_ids: [28, 80, 18] },
  { id: 496243, title: 'Parasite', poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', backdrop_path: '/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg', release_date: '2019-05-30', vote_average: 8.5, overview: 'Class discrimination themes.', genre_ids: [35, 53, 18] },
  { id: 545611, title: 'Everything Everywhere All at Once', poster_path: '/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg', backdrop_path: '/fOy2Jurz9k6RnJnMUMRDAgBwru2.jpg', release_date: '2022-03-25', vote_average: 7.8, overview: 'A middle-aged Chinese woman discovers she is connected to other universes.', genre_ids: [28, 12, 35, 878] },
  { id: 278, title: 'The Shawshank Redemption', poster_path: '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg', backdrop_path: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg', release_date: '1994-09-23', vote_average: 8.7, overview: 'Two imprisoned men bond over a number of years.', genre_ids: [18, 80] },
  { id: 438631, title: 'Dune', poster_path: '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', backdrop_path: '/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg', release_date: '2021-09-15', vote_average: 7.8, overview: 'A noble family becomes embroiled in a war for control over a desert planet.', genre_ids: [878, 12] },
  { id: 872585, title: 'Oppenheimer', poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg', release_date: '2023-07-21', vote_average: 8.1, overview: 'The story of J. Robert Oppenheimer.', genre_ids: [18, 36] },
  { id: 244786, title: 'Whiplash', poster_path: '/7fn624j5lj3xTme2SgiLCeuedmO.jpg', backdrop_path: '/6bbZ6XyvgfjhQwbplnUh1LSj1ky.jpg', release_date: '2014-10-10', vote_average: 8.4, overview: 'A promising young drummer enrolls at a cutthroat music conservatory.', genre_ids: [18, 10402] },
  { id: 313369, title: 'La La Land', poster_path: '/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', backdrop_path: '/nlPCdZlHtRNcF6C9hzUH4ebmV1w.jpg', release_date: '2016-12-09', vote_average: 7.9, overview: 'A jazz musician and an actress fall in love in Los Angeles.', genre_ids: [35, 18, 10402, 10749] },
  { id: 680, title: 'Pulp Fiction', poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', backdrop_path: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg', release_date: '1994-09-10', vote_average: 8.5, overview: 'The lives of two mob hitmen, a boxer, and more intertwine.', genre_ids: [53, 80] },
  { id: 238, title: 'The Godfather', poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', backdrop_path: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg', release_date: '1972-03-14', vote_average: 8.7, overview: 'The aging patriarch of an organized crime dynasty.', genre_ids: [18, 80] },
]

const MOCK_SERIES: TMDbSeries[] = [
  { id: 1396, name: 'Breaking Bad', poster_path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', backdrop_path: '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg', first_air_date: '2008-01-20', vote_average: 8.9, overview: 'A high school chemistry teacher turned drug lord.', genre_ids: [18, 80] },
  { id: 66732, name: 'Stranger Things', poster_path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', backdrop_path: '/56v2KjBlU4XaOv9rVYEQypROD7P.jpg', first_air_date: '2016-07-15', vote_average: 8.6, overview: 'Supernatural events unfold in a small town.', genre_ids: [18, 9648, 10765] },
  { id: 1399, name: 'Game of Thrones', poster_path: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', backdrop_path: '/suopoADq0k8YZr4dQXcU6pToj6s.jpg', first_air_date: '2011-04-17', vote_average: 8.4, overview: 'Noble families fight for control of the Iron Throne.', genre_ids: [18, 10759, 10765] },
  { id: 70523, name: 'Dark', poster_path: '/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg', backdrop_path: '/75GN8EuPDlTjCdldGoeJMrbQpB1.jpg', first_air_date: '2017-12-01', vote_average: 8.5, overview: 'A family saga with time travel elements in a German town.', genre_ids: [80, 18, 9648] },
  { id: 95396, name: 'Severance', poster_path: '/lFf6LLrQjYldcZItzOkGmMMigP7.jpg', backdrop_path: '/xjJDuR5E4sxjwGcJhJvFgdqvGJn.jpg', first_air_date: '2022-02-18', vote_average: 8.4, overview: 'Workers who have undergone a procedure to separate work memories.', genre_ids: [18, 9648, 10765] },
  { id: 136315, name: 'The Bear', poster_path: '/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg', backdrop_path: '/oeQXLRDFkVNpKqIBRWvX1y7VWaA.jpg', first_air_date: '2022-06-23', vote_average: 8.5, overview: 'A young chef returns to Chicago to run his family sandwich shop.', genre_ids: [18, 35] },
  { id: 76479, name: 'The Boys', poster_path: '/stTEycfG9928HYGEISBFaG1ngjM.jpg', backdrop_path: '/7cqKGQMnNabzOpi7qaIgZvQ7NGV.jpg', first_air_date: '2019-07-25', vote_average: 8.5, overview: 'A group of vigilantes fight corrupt superheroes.', genre_ids: [10759, 10765] },
  { id: 87108, name: 'Chernobyl', poster_path: '/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg', backdrop_path: '/900tHlUYUkp7Ol04XFSoAaEIXcT.jpg', first_air_date: '2019-05-06', vote_average: 8.7, overview: 'The story of the 1986 nuclear disaster.', genre_ids: [18, 36] },
  { id: 60735, name: 'The Flash', poster_path: '/rg8N7x27Ef6PvlIWEqpKIZSbfiy.jpg', backdrop_path: '/z59kJfcElR9eHO9rJbWp4qWMuee.jpg', first_air_date: '2014-10-07', vote_average: 7.8, overview: 'Barry Allen wakes from a coma with super speed.', genre_ids: [18, 10765] },
  { id: 94997, name: 'House of the Dragon', poster_path: '/z2yahl2uefxDCl0nogcRBstwruJ.jpg', backdrop_path: '/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg', first_air_date: '2022-08-21', vote_average: 8.4, overview: 'The story of House Targaryen.', genre_ids: [18, 10759, 10765] },
  { id: 84773, name: 'The Lord of the Rings: The Rings of Power', poster_path: '/NNC08YmJFFlLi1prBkK8quk3dp.jpg', backdrop_path: '/mYLOqiStMxDK3fYZFirgrMt8z5d.jpg', first_air_date: '2022-09-01', vote_average: 7.4, overview: 'Epic drama set in Middle-earth.', genre_ids: [10759, 18, 10765] },
  { id: 63174, name: 'Lucifer', poster_path: '/ekZobS8isE6mA53RAiGDG93hBxL.jpg', backdrop_path: '/ta5obvpMlGTVhUkGhCcR1GFZAPX.jpg', first_air_date: '2016-01-25', vote_average: 8.5, overview: 'Lucifer abandons Hell for Los Angeles.', genre_ids: [80, 10765] },
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
