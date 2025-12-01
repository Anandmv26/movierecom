export type Mood = 'Happy' | 'Sad' | 'Excited' | 'Calm' | 'Curious';

export type Language = 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Malayalam';

export type Platform = 'Netflix' | 'Amazon Prime' | 'Hotstar' | 'Sony LIV' | 'Zee5' | 'Others';

export type ContentType = 'Movie' | 'Series' | 'Both';

export interface MovieRecommendation {
  movie_name: string;
  genre: string;
  mood: string;
  language: string;
  duration: string;  // String format like "120 mins" or "2 seasons, 16 episodes, ~40 mins each"
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
  languages: Language[];
  platforms: Platform[];
  contentTypes: ContentType[];
  /**
   * Optional list of titles that should NOT appear in new recommendations.
   * Matching is done against movie_name (case-insensitive).
   */
  excludeTitles?: string[];
}

export interface MovieCardProps {
  movie: MovieRecommendation;
  onClick: () => void;
} 