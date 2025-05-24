import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPreferences, Mood, Genre, Language, Duration, Platform } from '../types';

interface PreferencesFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isLoading: boolean;
}

const MOODS: Mood[] = ['Happy', 'Sad', 'Relaxed', 'Excited', 'Thoughtful'];
const GENRES: Genre[] = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Romance', 'Open to any'];
const LANGUAGES: Language[] = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Open to any'];
const DURATIONS: Duration[] = ['Short < 90 minutes', 'Medium 90-120 minutes', 'Long > 120 minutes'];
const PLATFORMS: Platform[] = ['Netflix', 'Amazon Prime', 'Hotstar', 'Other Indian platforms', 'Anything'];

export const PreferencesForm = ({ onSubmit, isLoading }: PreferencesFormProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    mood: 'Happy',
    genres: [],
    languages: [],
    duration: 'Medium',
    platforms: []
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
      className="space-y-6 p-6 bg-cinematic-card rounded-xl"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-sm font-medium mb-2">How are you feeling?</label>
        <select
          className="input-field w-full"
          value={preferences.mood}
          onChange={(e) => setPreferences({ ...preferences, mood: e.target.value as Mood })}
        >
          {MOODS.map(mood => (
            <option key={mood} value={mood}>{mood}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Genres</label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map(genre => (
            <button
              key={genre}
              type="button"
              className={`chip ${preferences.genres.includes(genre) ? 'chip-selected' : ''}`}
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
        <label className="block text-sm font-medium mb-2">Languages</label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(language => (
            <button
              key={language}
              type="button"
              className={`chip ${preferences.languages.includes(language) ? 'chip-selected' : ''}`}
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
        <label className="block text-sm font-medium mb-2">Duration</label>
        <div className="flex gap-2">
          {DURATIONS.map(duration => (
            <button
              key={duration}
              type="button"
              className={`chip ${preferences.duration === duration ? 'chip-selected' : ''}`}
              onClick={() => setPreferences({ ...preferences, duration })}
            >
              {duration}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Streaming Platforms</label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map(platform => (
            <button
              key={platform}
              type="button"
              className={`chip ${preferences.platforms.includes(platform) ? 'chip-selected' : ''}`}
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

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={isLoading || preferences.genres.length === 0 || preferences.languages.length === 0 || preferences.platforms.length === 0}
      >
        {isLoading ? 'Finding Movies...' : 'Get Movie Recommendations'}
      </button>
    </motion.form>
  );
}; 