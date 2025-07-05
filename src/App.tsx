import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PreferencesForm } from './components/PreferencesForm';
import { getMovieRecommendations } from './services/api';
import { UserPreferences, MovieRecommendation } from './types';
import { StarIcon, ClockIcon, FilmIcon } from '@heroicons/react/24/solid';
import { PlayIcon } from '@heroicons/react/24/outline';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950 text-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-blue-900/90 backdrop-blur-sm z-10 py-2 shadow-lg">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center app-title bg-gradient-to-r from-purple-400 via-white-400 to-indigo-400 bg-clip-text drop-shadow-lg"
          >
            Cinefy
          </motion.h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-[70px]">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Preferences Form - 4 columns (40%) */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-4">
              <PreferencesForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>

          {/* Movie Cards - 6 columns (60%) */}
          <div className="lg:col-span-6 space-y-3 lg:max-h-[calc(108vh-150px)] lg:overflow-y-auto pr-2 pb-4
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-purple-500 [&::-webkit-scrollbar-thumb]:to-indigo-500
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb:hover]:from-purple-600 [&::-webkit-scrollbar-thumb:hover]:to-indigo-600
            [scrollbar-width:thin]
            [scrollbar-color:theme(colors.purple.500)_transparent]">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200"
              >
                {error}
              </motion.div>
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-lg bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-white/10 text-center"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-purple-200 font-medium">Finding your perfect recommendations...</p>
                  <p className="text-indigo-300 text-sm">This may take a few moments</p>
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {!isLoading && movies.length === 0 && !error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-lg bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-white/10 text-center"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <FilmIcon className="w-12 h-12 text-purple-400" />
                    <p className="text-purple-200 font-medium">Ready to discover amazing content?</p>
                    <p className="text-indigo-300 text-sm">Fill out your preferences and get personalized recommendations</p>
                  </div>
                </motion.div>
              )}
              
              {!isLoading && movies.map((movie, index) => (
                <motion.div
                  key={movie.movie_name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/10"
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-transparent bg-clip-text">
                        {movie.movie_name}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center text-yellow-400">
                          <StarIcon className="w-5 h-5 mr-1" />
                          {movie.ratings.imdb}
                        </span>
                        <span className="flex items-center text-red-400">
                          <FilmIcon className="w-5 h-5 mr-1" />
                          {movie.ratings.rottenTomatoes}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">
                        {movie.genre}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm">
                        {movie.language}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                        {movie.platform}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-sm flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {movie.duration}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm">
                        {movie.mood}
                      </span>
                    </div>

                    <p className="text-gray-300 leading-relaxed">{movie.synopsis}</p>

                    <div className="space-y-3 pt-2">
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center">
                          <span className="text-indigo-300 font-medium mr-2">Director:</span>
                          <span className="text-white">{movie.crew.director}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-indigo-300 font-medium mr-2">Writers:</span>
                          <span className="text-white">{movie.crew.writers.join(', ')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-indigo-300 font-medium mr-2">Cast:</span>
                          <span className="text-white">{movie.cast.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={movie.trailer_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      <PlayIcon className="w-5 h-5 mr-2" />
                      Watch Trailer
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 