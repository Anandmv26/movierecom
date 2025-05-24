import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PreferencesForm } from './components/PreferencesForm';
import { getMovieRecommendations } from './services/api';
import { UserPreferences, MovieRecommendation } from './types';
import { StarIcon, ClockIcon, FilmIcon } from '@heroicons/react/24/solid';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState<MovieRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(() => {
    // Try to get API key from environment variable first
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (envApiKey) {
      return envApiKey
    }
    // Fallback to localStorage if no env variable
    return localStorage.getItem('openai_api_key') || ''
  });

  const handleSubmit = async (preferences: UserPreferences) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // If no API key is stored, prompt for it
      if (!apiKey) {
        const newApiKey = prompt('Please enter your OpenAI API key:');
        if (!newApiKey) {
          throw new Error('API key is required');
        }
        setApiKey(newApiKey);
        localStorage.setItem('openai_api_key', newApiKey);
      }
      
      const recommendations = await getMovieRecommendations(preferences, apiKey);
      setMovies(recommendations);
    } catch (err) {
      // If there's an authentication error, clear the stored API key
      if (err instanceof Error && err.message.includes('Invalid API key')) {
        setApiKey('');
        localStorage.removeItem('openai_api_key');
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cinematic-bg text-cinematic-text">

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-cinematic-bg z-10 py-4 shadow-md">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-center"
          >
            Cinefy 🎬
          </motion.h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-[75px]"> {/* Padding to accommodate fixed header */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Preferences Form - 4 columns (40%) */}
          <div className="lg:col-span-4">
            <div className="sticky top-4"> {/* Removed fixed height */}
              <PreferencesForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>

          {/* Movie Cards - 6 columns (60%) */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-32"
                >
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cinematic-accent"></div>
                </motion.div>
              ) : movies.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid gap-6"
                >
                  {movies.map((movie) => (
                    <motion.div
                      key={movie.movie_name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-cinematic-card rounded-xl p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold">{movie.movie_name}</h2>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <StarIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">IMDb: {movie.ratings.imdb}</span>
                          </div>
                          <div className="flex items-center gap-1 text-red-500">
                            <span className="text-sm font-medium">RT: {movie.ratings.rottenTomatoes}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-4">
                        <div>
                          <h3 className="text-sm font-medium text-cinematic-text-secondary mb-2">Crew</h3>
                          <div className="space-y-1.5">
                            <p className="text-sm">
                              <span className="font-medium">Director:</span> {movie.crew.director}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Writers:</span> {movie.crew.writers.join(', ')}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-cinematic-text-secondary mb-2">Details</h3>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="chip text-xs py-0.5">{movie.genre}</span>
                              <span className="chip text-xs py-0.5">{movie.language}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4 text-cinematic-text-secondary" />
                                <span>{movie.duration} min</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FilmIcon className="w-4 h-4 text-cinematic-text-secondary" />
                                <span>{movie.platform}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-cinematic-text-secondary mb-2">Cast</h3>
                        <p className="text-sm">{movie.cast.join(', ')}</p>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-cinematic-text-secondary mb-2">Synopsis</h3>
                        <p className="text-sm text-cinematic-text-secondary">{movie.synopsis}</p>
                      </div>

                      <a
                        href={movie.trailer_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-block text-sm py-2 px-6"
                      >
                        Watch Trailer
                      </a>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-cinematic-text-secondary py-8 text-sm"
                >
                  Select your preferences to get movie recommendations
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 