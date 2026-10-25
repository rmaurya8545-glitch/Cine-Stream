import { useEffect, useState, useRef, useCallback } from "react";
import { getPopularMovies, searchMovies} from "./api/tmdb";
import Posts from "./components/Posts";
import MovieGrid from "./components/MovieGrid";
import SearchBar from "./components/SearchBar";
import Navbar from "./components/Navbar";
import MoodMatcher from "./components/MoodMatcher";
import MovieCard from "./components/MovieCard";


function App(){
    const [movies, setMovies] = useState([]);
    const [favorites, setFavorites] = useState(() => {
        const stored = localStorage.getItem("favorites");
        return stored ? JSON.parse(stored) : [];
    });

    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");
    const [effectiveQuery, setEffectiveQuery] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [moodMovie, setMoodMovie] = useState(null);


    useEffect(() => {
  setLoading(true);

  const searchTerm = effectiveQuery || query; // fallback query use karo agar set hai
  const fetchFn = searchTerm.trim()
    ? searchMovies(searchTerm, page)
    : getPopularMovies(page);

  fetchFn
    .then((data) => {
      let results = data.results || [];

      // Sirf page 1 pe fallback try karo, aur sirf jab effectiveQuery abhi set nahi hui
      if (results.length === 0 && query.trim() && page === 1 && !effectiveQuery) {
        const words = query.trim().split(" ").filter((w) => w.length > 2);
        const fallbackWord = words.sort((a, b) => b.length - a.length)[0];

        if (fallbackWord && fallbackWord.toLowerCase() !== query.trim().toLowerCase()) {
          setEffectiveQuery(fallbackWord); // ye trigger karega useEffect dobara, naye searchTerm ke saath
          return;
        }
      }

      setMovies((prev) => {
  if (page === 1) return results;
  const existingIds = new Set(prev.map((m) => m.id));
  const newResults = results.filter((m) => !existingIds.has(m.id));
  return [...prev, ...newResults];
});
      setHasMore(page < (data.total_pages || 1));
    })
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
}, [page, query, effectiveQuery]);
    // useEffect(() => {
    //     getPopularMovies()
    //     .then((data) => setMovies(data.results || []))
    //     .catch((err) => console.error(err));
    // }, []);

   const handleSearch = (newQuery) => {
       setQuery(newQuery);
       setEffectiveQuery(""); // purana fallback clear karo
       setPage(1);
    };
    const toggleFavorite = (movie) => {
        setFavorites((prev) =>{
            const exists = prev.some((fav) => fav.id === movie.id);
            if(exists) return prev.filter((fav) => fav.id !== movie.id);
            return [...prev, movie];
            
        });
    };

    const observer = useRef();
    const lastMovieRef = useCallback(
        (node) => {
            if(loading) return;
            if(observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if(entries[0].isIntersecting && hasMore){
                    setPage((prev) => prev + 1);
                }
            });

            if(node) observer.current.observe(node);
        },
        [loading, hasMore]
    );
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors">
        <Navbar onSearch={handleSearch} />

        <Posts />

            {/* Hero/Banner section */}
            <div className="px-4 py-16 sm:py-20 text-center bg-linear-to-r from-indigo-500 
            via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-gray-900">
                <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                    🎬 Discover Your Next Favorite Movie
                </h2>
                <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
                    Search, explore, and save movies you love — all in one place.
                </p>
            </div>
            <MoodMatcher onResult={(movie) => setMoodMovie(movie)} />

{moodMovie && (
  <div className="px-4 mb-4">
    <h3 className="text-gray-900 dark:text-white font-semibold mb-2">
      Recommended for your mood:
    </h3>
    <div className="max-w-50">
      <MovieCard
        movie={moodMovie}
        isFavorite={favorites.some((fav) => fav.id === moodMovie.id)}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  </div>
)}
            <MovieGrid
                
                movies={movies}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                lastMovieRef={lastMovieRef}
            />
            
            {loading && (
                <p className="text-gray-900 dark:text-white text-center py-4">
                    Loading more movies...
                </p>
            )}
        </div>
    );
}
export default App;



