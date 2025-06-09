import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPreferences, Mood, Genre, Language, DurationPreference, Platform, ContentType, DURATION_RANGES } from '../types';

interface PreferencesFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isLoading: boolean;
}

const MOODS: { value: Mood; emoji: string }[] = [
  { value: 'Happy', emoji: '😊' },
  { value: 'Sad', emoji: '😔' },
  { value: 'Relaxed', emoji: '😌' },
  { value: 'Excited', emoji: '🤩' },
  { value: 'Thoughtful', emoji: '🤔' },
];

const GENRES: Genre[] = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Romance', 'Open to any'];
const LANGUAGES: Language[] = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Open to any'];
const DURATIONS: DurationPreference[] = ['Short', 'Medium', 'Long'];

const DURATION_DISPLAY: Record<DurationPreference, string> = {
  'Short': `Short (${DURATION_RANGES.Short.min}-${DURATION_RANGES.Short.max} min)`,
  'Medium': `Medium (${DURATION_RANGES.Medium.min}-${DURATION_RANGES.Medium.max} min)`,
  'Long': `Long (${DURATION_RANGES.Long.min}+ min)`
};

const PLATFORMS: Platform[] = ['Netflix', 'Amazon Prime', 'Hotstar', 'Other Indian platforms', 'Anything'];

const CONTENT_TYPES: ContentType[] = ['Movie', 'Series', 'Both'];

export const PreferencesForm = ({ onSubmit, isLoading }: PreferencesFormProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    mood: '' as Mood,
    genres: [],
    languages: [],
    duration: '' as DurationPreference,
    platforms: [],
    contentTypes: []
  });

  const toggleArrayItem = <T extends string>(array: T[], item: T): T[] => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col lg:h-[calc(100vh-6rem)] h-auto bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-xl shadow-xl backdrop-blur-sm bg-opacity-90 text-white overflow-hidden"
      onSubmit={handleSubmit}
    >
      {/* Scrollable content area with themed scrollbar - only on lg screens */}
      <div className="flex-1 lg:overflow-y-auto overflow-visible px-6 py-6 space-y-4
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-purple-500 [&::-webkit-scrollbar-thumb]:to-indigo-500
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb:hover]:from-purple-600 [&::-webkit-scrollbar-thumb:hover]:to-indigo-600
        [scrollbar-width:thin]
        [scrollbar-color:theme(colors.purple.500)_transparent]">
        {/* Center content vertically when there's extra space - only on lg screens */}
        <div className="lg:min-h-full lg:flex lg:flex-col lg:justify-center">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-indigo-200">Content Type</label>
              <div className="grid grid-cols-3 gap-2">
                {CONTENT_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${preferences.contentTypes.includes(type) 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                        : 'bg-white/10 hover:bg-white/20 text-indigo-100'}`}
                    onClick={() => setPreferences({
                      ...preferences,
                      contentTypes: toggleArrayItem(preferences.contentTypes, type)
                    })}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-indigo-200">How are you feeling?</label>
              <div className="grid grid-cols-3 gap-2">
                {MOODS.map(moodOption => (
                  <button
                    key={moodOption.value}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${preferences.mood === moodOption.value 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                        : 'bg-white/10 hover:bg-white/20 text-indigo-100'}`}
                    onClick={() => setPreferences({ ...preferences, mood: moodOption.value })}
                  >
                    {moodOption.value} {moodOption.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-indigo-200">Genres</label>
              <div className="grid grid-cols-3 gap-2">
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${preferences.genres.includes(genre) 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                        : 'bg-white/10 hover:bg-white/20 text-indigo-100'}`}
                    onClick={() => setPreferences({
                      ...preferences,
                      genres: toggleArrayItem(preferences.genres, genre)
                    })}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-indigo-200">Languages</label>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map(language => (
                  <button
                    key={language}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${preferences.languages.includes(language) 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                        : 'bg-white/10 hover:bg-white/20 text-indigo-100'}`}
                    onClick={() => setPreferences({
                      ...preferences,
                      languages: toggleArrayItem(preferences.languages, language)
                    })}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-indigo-200">Duration</label>
              <div className="grid grid-cols-3 gap-2">
                {DURATIONS.map(duration => (
                  <button
                    key={duration}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${preferences.duration === duration 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                        : 'bg-white/10 hover:bg-white/20 text-indigo-100'}`}
                    onClick={() => setPreferences({ ...preferences, duration })}
                  >
                    {DURATION_DISPLAY[duration]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-indigo-200">Streaming Platforms</label>
              <div className="grid grid-cols-3 gap-2">
                {PLATFORMS.map(platform => (
                  <button
                    key={platform}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${preferences.platforms.includes(platform) 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                        : 'bg-white/10 hover:bg-white/20 text-indigo-100'}`}
                    onClick={() => setPreferences({
                      ...preferences,
                      platforms: toggleArrayItem(preferences.platforms, platform)
                    })}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit button with gradient background that respects rounded corners */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-purple-900/90 to-transparent backdrop-blur-sm border-t border-white/10 rounded-b-xl"></div>
        <div className="relative px-6 py-4">
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg text-base font-medium transition-all duration-200
              bg-gradient-to-r from-purple-500 to-indigo-500 text-white
              hover:from-purple-600 hover:to-indigo-600
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            disabled={isLoading || 
              preferences.contentTypes.length === 0 ||
              !preferences.mood || 
              preferences.genres.length === 0 || 
              preferences.languages.length === 0 || 
              preferences.platforms.length === 0 || 
              !preferences.duration}
          >
            {isLoading ? 'Finding Recommendations...' : 'Get Recommendations'}
          </button>
        </div>
      </div>
    </motion.form>
  );
}; 