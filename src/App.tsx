import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PreferencesForm } from './components/PreferencesForm';
import { MovieCard } from './components/MovieCard';
import { MovieModal } from './components/MovieModal';
import { getMovieRecommendations } from './services/api';
import { UserPreferences, MovieRecommendation } from './types';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState<MovieRecommendation[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieRecommendation | null>(null);
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
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8"
        >
          Mood Movies 🎬
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <PreferencesForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 rounded-lg mb-4"
                >
                  {error}
                </motion.div>
              )}

              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-64"
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cinematic-accent"></div>
                </motion.div>
              ) : movies.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {movies.map((movie, index) => (
                    <MovieCard
                      key={movie.movie_name}
                      movie={movie}
                      onClick={() => setSelectedMovie(movie)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-cinematic-text-secondary py-12"
                >
                  Select your preferences to get movie recommendations
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <MovieModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}

export default App; 