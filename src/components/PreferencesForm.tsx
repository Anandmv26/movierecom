import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPreferences, Mood, Genre, Language, DurationPreference, Platform, DURATION_RANGES } from '../types';

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

export const PreferencesForm = ({ onSubmit, isLoading }: PreferencesFormProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    mood: 'Happy',
    genres: [],
    languages: [],
    duration: '' as DurationPreference,
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
      className="space-y-3 p-4 bg-cinematic-card rounded-xl h-full flex flex-col"
      onSubmit={handleSubmit}
    >
      <div className="space-y-3 flex-1">
        <div>
          <label className="block text-sm font-medium mb-1">How are you feeling?</label>
          <div className="grid grid-cols-3 gap-1.5">
            {MOODS.map(moodOption => (
              <button
                key={moodOption.value}
                type="button"
                className={`chip text-sm py-1 ${preferences.mood === moodOption.value ? 'chip-selected' : ''}`}
                onClick={() => setPreferences({ ...preferences, mood: moodOption.value })}
              >
                {moodOption.value} {moodOption.emoji}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Genres</label>
          <div className="grid grid-cols-3 gap-1.5">
            {GENRES.map(genre => (
              <button
                key={genre}
                type="button"
                className={`chip text-sm py-1 ${preferences.genres.includes(genre) ? 'chip-selected' : ''}`}
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
          <label className="block text-sm font-medium mb-1">Languages</label>
          <div className="grid grid-cols-3 gap-1.5">
            {LANGUAGES.map(language => (
              <button
                key={language}
                type="button"
                className={`chip text-sm py-1 ${preferences.languages.includes(language) ? 'chip-selected' : ''}`}
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
          <label className="block text-sm font-medium mb-1">Duration</label>
          <div className="grid grid-cols-3 gap-1.5">
            {DURATIONS.map(duration => (
              <button
                key={duration}
                type="button"
                className={`chip text-sm py-1 ${preferences.duration === duration ? 'chip-selected' : ''}`}
                onClick={() => setPreferences({ ...preferences, duration })}
              >
                {DURATION_DISPLAY[duration]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Streaming Platforms</label>
          <div className="grid grid-cols-3 gap-1.5">
            {PLATFORMS.map(platform => (
              <button
                key={platform}
                type="button"
                className={`chip text-sm py-1 ${preferences.platforms.includes(platform) ? 'chip-selected' : ''}`}
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

      <button
        type="submit"
        className="btn-primary w-full py-2 text-base mt-3"
        disabled={isLoading || preferences.genres.length === 0 || preferences.languages.length === 0 || preferences.platforms.length === 0 || !preferences.duration}
      >
        {isLoading ? 'Finding Movies...' : 'Get Movie Recommendations'}
      </button>
    </motion.form>
  );
}; 