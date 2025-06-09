export type Mood = 'Happy' | 'Sad' | 'Relaxed' | 'Excited' | 'Thoughtful';

export type Genre = 'Action' | 'Comedy' | 'Drama' | 'Sci-Fi' | 'Romance' | 'Open to any';

export type Language = 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Malayalam' | 'Open to any';

export type Duration = 'Short' | 'Medium' | 'Long';

export type Platform = 'Netflix' | 'Amazon Prime' | 'Hotstar' | 'Other Indian platforms' | 'Anything';

export type ContentType = 'Movie' | 'Series' | 'Both';

// Duration preference for user input
export type DurationPreference = 'Short' | 'Medium' | 'Long';

// Duration display mapping for user interface
export const DURATION_RANGES: Record<DurationPreference, { min: number; max: number }> = {
  'Short': { min: 0, max: 90 },
  'Medium': { min: 90, max: 120 },
  'Long': { min: 120, max: Infinity }
};

export interface MovieRecommendation {
  movie_name: string;
  genre: string;
  mood: string;
  language: string;
  duration: number;  // Changed to number for exact minutes
  platform: string;
  cast: string[];
  crew: {
    director: string;
    writers: string[];
  };
  ratings: {
    imdb: string;
    rottenTomatoes: string;
  };
  synopsis: string;
  trailer_link: string;
}

export interface UserPreferences {
  mood: Mood;
  genres: Genre[];
  languages: Language[];
  duration: DurationPreference;
  platforms: Platform[];
  contentTypes: ContentType[];
}

export interface MovieCardProps {
  movie: MovieRecommendation;
  onClick: () => void;
} 