import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPreferences, Mood, Language, Platform, ContentType } from '../types';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface PreferencesFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isLoading: boolean;
}

const MOODS: { value: Mood; emoji: string }[] = [
  { value: 'Happy', emoji: '😊' },
  { value: 'Sad', emoji: '😔' },
  { value: 'Excited', emoji: '🤩' },
  { value: 'Calm', emoji: '😌' },
  { value: 'Curious', emoji: '🤔' },
];


const LANGUAGES: Language[] = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam'];

const PLATFORMS: Platform[] = ['Netflix', 'Amazon Prime', 'Hotstar', 'Sony LIV', 'Zee5', 'Others'];

const CONTENT_TYPES: ContentType[] = ['Movie', 'Series', 'Both'];

export const PreferencesForm = ({ onSubmit, isLoading }: PreferencesFormProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    mood: '' as Mood,
    languages: [],
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
      className="flex flex-col lg:h-[calc(100vh-4.5rem)] h-auto bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-xl shadow-xl backdrop-blur-sm bg-opacity-90 text-white overflow-hidden"
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
              <div className="grid grid-cols-3 gap-3">
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
                      contentTypes: [type]
                    })}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-indigo-200">How are you feeling?</label>
              <div className="grid grid-cols-3 gap-3">
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-indigo-200">
                  Languages <span className="text-xs text-indigo-300">(Choose one or more)</span>
                </label>
                <button
                  type="button"
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200
                    ${preferences.languages.length === LANGUAGES.length 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                      : 'bg-white/10 hover:bg-white/20 text-indigo-100'}`}
                  onClick={() => setPreferences({
                    ...preferences,
                    languages: preferences.languages.length === LANGUAGES.length ? [] : LANGUAGES
                  })}
                >
                  {preferences.languages.length === LANGUAGES.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {LANGUAGES.map(language => (
                  <button
                    key={language}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between
                      ${preferences.languages.includes(language) 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                        : 'bg-white/10 hover:bg-white/20 text-indigo-100'}`}
                    onClick={() => setPreferences({
                      ...preferences,
                      languages: toggleArrayItem(preferences.languages, language)
                    })}
                  >
                    <span>{language}</span>
                    {preferences.languages.includes(language) && (
                      <span className="text-white text-sm font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-indigo-200">
                  Streaming Platforms <span className="text-xs text-indigo-300">(Choose one or more)</span>
                </label>
                <button
                  type="button"
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200
                    ${preferences.platforms.length === PLATFORMS.length 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                      : 'bg-white/10 hover:bg-white/20 text-indigo-100'}`}
                  onClick={() => setPreferences({
                    ...preferences,
                    platforms: preferences.platforms.length === PLATFORMS.length ? [] : PLATFORMS
                  })}
                >
                  {preferences.platforms.length === PLATFORMS.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {PLATFORMS.map(platform => (
                  <button
                    key={platform}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between
                      ${preferences.platforms.includes(platform) 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                        : 'bg-white/10 hover:bg-white/20 text-indigo-100'}`}
                    onClick={() => setPreferences({
                      ...preferences,
                      platforms: toggleArrayItem(preferences.platforms, platform)
                    })}
                  >
                    <span>{platform}</span>
                    {preferences.platforms.includes(platform) && (
                      <span className="text-white text-sm font-bold">
                        ✓
                      </span>
                    )}
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
        <div className="relative px-6 py-3">
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg text-base font-medium transition-all duration-200
              bg-gradient-to-r from-purple-500 to-indigo-500 text-white
              hover:from-purple-600 hover:to-indigo-600
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-2"
            disabled={isLoading || 
              preferences.contentTypes.length === 0 ||
              !preferences.mood || 
              preferences.languages.length === 0 || 
              preferences.platforms.length === 0}
          >
            <SparklesIcon className="w-5 h-5" />
            <span>{isLoading ? 'Finding Recommendations...' : 'Get Recommendations'}</span>
          </button>
        </div>
      </div>
    </motion.form>
  );
}; 