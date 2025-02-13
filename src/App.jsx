import { useState, useEffect } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite.js';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [isTrendingLoading, setIsTrendingLoading] = useState(false); // New state variable
    const [currentPage, setCurrentPage] = useState(1); // New state variable for current page
    const [totalPages, setTotalPages] = useState(1); // New state variable for total pages

    useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

    const fetchMovies = async (query = '', page = 1) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }

            const data = await response.json();
            console.log(data);
            if (data.response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }
            setMovieList(data.results || []);
            setTotalPages(data.total_pages || 1); // Update total pages

            if (query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }
        }
        catch (error) {
            console.error(`Error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies. Please try again later.');
        }
        finally {
            setIsLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        setIsTrendingLoading(true); // Set loading state to true
        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        }
        catch (error) {
            console.error(`Error fetching trending movies: ${error}`);
        }
        finally {
            setIsTrendingLoading(false); // Set loading state to false
        }
    }

    useEffect(() => {
        fetchMovies(debounceSearchTerm, currentPage);
    }, [debounceSearchTerm, currentPage]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);

    return (
        <main>
            <div className='pattern' />
            <div className='wrapper'>
                <header>
                    <img src="./logo.png" alt="Logo" className="w-20 h-20" />
                    <img src="./hero.png" alt="Hero Banner" />
                    <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>
                {(isTrendingLoading || trendingMovies.length > 0) && (
                    <section className='trending'>
                        <h2>Recommended</h2>
                        {isTrendingLoading ? (
                            <Spinner />
                        ) : (
                            <ul>
                                {trendingMovies.map((movie, index) => (
                                    <li key={movie.$id}>
                                        <p>{index + 1}</p>
                                        <img src={movie.poster_url} alt={movie.title} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )}
                <section className='all-movies'>
                    <h2>Popular</h2>
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className='text-red-500'>{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                    {movieList.length > 0 && (
                        <div className='pagination'>
                            <button
                                className='page-button'
                                onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <img src="/left-arrow.svg" alt="previous" />
                            </button>
                            <span className='text-white'>{currentPage}</span>
                            <button
                                className='page-button'
                                onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <img src="/right-arrow.svg" alt="next" />
                            </button>
                        </div>)}
                </section>
            </div>
        </main>
    )
}

export default App