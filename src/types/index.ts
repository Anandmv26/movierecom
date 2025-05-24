export type Mood = 'Happy' | 'Sad' | 'Relaxed' | 'Excited' | 'Thoughtful';

export type Genre = 'Action' | 'Comedy' | 'Drama' | 'Sci-Fi' | 'Romance' | 'Open to any';

export type Language = 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Malayalam' | 'Open to any';

export type Duration = 'Short' | 'Medium' | 'Long';

export type Platform = 'Netflix' | 'Amazon Prime' | 'Hotstar' | 'Other Indian platforms' | 'Anything';

export interface MovieRecommendation {
  movie_name: string;
  genre: string;
  mood: string;
  language: string;
  duration: string;
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
  duration: Duration;
  platforms: Platform[];
}

export interface MovieCardProps {
  movie: MovieRecommendation;
  onClick: () => void;
} 