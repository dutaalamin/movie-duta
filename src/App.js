import "./App.css"
import { getMovieList, searchMovie } from "./api"
import { useEffect, useState } from "react"

const App = () => { 
  const [popularMovies, setPopularMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const API_KEY = process.env.REACT_APP_TMDB_TOKEN

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchMovies = async () => {
      console.log('Environment:', {
        isDevelopment: process.env.NODE_ENV === 'development',
        apiKey: process.env.REACT_APP_TMDB_TOKEN ? 'Ada' : 'Tidak Ada'
      });

      try {
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        console.log('Fetching URL:', url);

        const response = await fetch(url);
        const data = await response.json();
        setPopularMovies(data.results);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const MovieCard = ({ movie, index }) => (
    <div className="Movie-wrapper" key={movie.id || index}>
      <div className="Movie-poster">
        <img
          className="Movie-image"
          src={`${process.env.REACT_APP_BASEIMGURL}/${movie.poster_path}`}
          alt={movie.title}
          loading="lazy"
        />
        <div className="Movie-rate">
          <span role="img" aria-label="rating">⭐</span> {movie.vote_average.toFixed(1)}
        </div>
        <div className="Movie-overlay">
          <p className="Movie-overview">{movie.overview}</p>
        </div>
      </div>
      <div className="Movie-info">
        <h2 className="Movie-title">{movie.title}</h2>
        <div className="release-info">
          <span className="release-label">Release Date</span>
          <div className="release-date">
            <span className="date">
              {new Date(movie.release_date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  const PopularMovieList = () => {
    if (isLoading) {
      return (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Memuat data film...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="error">
          <span role="img" aria-label="error">❌</span>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Coba Lagi</button>
        </div>
      )
    }

    if (!popularMovies || popularMovies.length === 0) {
      return (
        <div className="no-results">
          <span role="img" aria-label="not found">🔍</span>
          <p>Tidak ada film yang ditemukan</p>
        </div>
      )
    }

    return popularMovies.map((movie, i) => (
      <MovieCard movie={movie} index={i} key={movie.id || i} />
    ))
  }

  const search = async (q) => {
    setSearchQuery(q)
    if (q.length > 2) {
      try {
        setIsLoading(true)
        const query = await searchMovie(q)
        setPopularMovies(query.results)
        setError(null)
      } catch (error) {
        console.error("Error searching movies:", error)
        setError("Gagal mencari film. Silakan coba lagi.")
      } finally {
        setIsLoading(false)
      }
    } else if (q.length === 0) {
      const result = await getMovieList()
      setPopularMovies(result)
    }
  }

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="App-header">
        <nav className="navbar">
          <div className="navbar-content">
            <div className="brand-logo">
              <span className="movie-icon">🎬</span>
              <h1>Duta Movies</h1>
            </div>
            <div className="nav-controls">
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="search"
                  placeholder="Search Movies..."
                  className="Movie-search"
                  value={searchQuery}
                  onChange={({ target }) => search(target.value)}
                />
              </div>
              <button 
                className="theme-toggle"
                onClick={() => setIsDarkMode(!isDarkMode)}
                aria-label="Toggle theme"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div className="Movie-container">
          <PopularMovieList />
        </div>
      </main>

      <footer className="App-footer">
        <p>© 2024 Duta Movies</p>
      </footer>

      <div style={{display: 'none'}}>
        API Key tersedia: {process.env.REACT_APP_TMDB_TOKEN ? 'Ya' : 'Tidak'}
      </div>
    </div>
  )
}

export default App
