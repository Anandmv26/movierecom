import axios, { AxiosError } from 'axios';
import { UserPreferences, MovieRecommendation } from '../types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const validateMovieRecommendation = (movie: any): MovieRecommendation => {
  if (!movie || typeof movie !== 'object') {
    throw new Error('Invalid movie recommendation format');
  }

  const requiredFields = {
    movie_name: 'string',
    genre: 'string',
    mood: 'string',
    language: 'string',
    duration: 'number',
    platform: 'string',
    cast: 'array',
    crew: 'object',
    ratings: 'object',
    synopsis: 'string',
    trailer_link: 'string'
  };

  for (const [field, type] of Object.entries(requiredFields)) {
    if (!(field in movie)) {
      throw new Error(`Missing required field: ${field}`);
    }
    if (type === 'array' && !Array.isArray(movie[field])) {
      throw new Error(`Invalid format for field: ${field} - must be an array`);
    }
    if (type === 'object' && (typeof movie[field] !== 'object' || Array.isArray(movie[field]))) {
      throw new Error(`Invalid format for field: ${field} - must be an object`);
    }
    if (type === 'string' && typeof movie[field] !== 'string') {
      throw new Error(`Invalid format for field: ${field} - must be a string`);
    }
    if (type === 'number' && (typeof movie[field] !== 'number' || isNaN(movie[field]))) {
      throw new Error(`Invalid format for field: ${field} - must be a number`);
    }
  }

  if (movie.duration <= 0) {
    throw new Error('Duration must be a positive number');
  }

  if (!Array.isArray(movie.cast)) {
    throw new Error('Cast must be an array');
  }

  if (!movie.crew || typeof movie.crew !== 'object' || Array.isArray(movie.crew)) {
    throw new Error('Invalid crew format - must be an object');
  }

  if (!movie.crew.director || typeof movie.crew.director !== 'string') {
    throw new Error('Missing or invalid director');
  }

  if (!Array.isArray(movie.crew.writers)) {
    throw new Error('Writers must be an array');
  }

  if (!movie.ratings || typeof movie.ratings !== 'object' || Array.isArray(movie.ratings)) {
    throw new Error('Invalid ratings format - must be an object');
  }

  if (!movie.ratings.imdb || typeof movie.ratings.imdb !== 'string') {
    throw new Error('Missing or invalid IMDb rating');
  }

  if (!movie.ratings.rottenTomatoes || typeof movie.ratings.rottenTomatoes !== 'string') {
    throw new Error('Missing or invalid Rotten Tomatoes rating');
  }

  return {
    ...movie,
    duration: Number(movie.duration)
  };
};

export const getMovieRecommendations = async (
  preferences: UserPreferences,
  apiKey: string
): Promise<MovieRecommendation[]> => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o-2024-08-06',
        messages: [
          {
            role: 'system',
            content: `You are an expert movie and series recommendation assistant with deep knowledge of global cinema. Your task is to recommend exactly 3 movies/series based on user preferences. 

Key requirements:
1. For "Sad" mood, recommend uplifting, feel-good content that can help improve the user's mood
2. Verify that all recommended content is actually available on the specified streaming platforms
3. Include diverse recommendations that match the user's preferences while introducing them to new content
4. Respect the user's content type preferences (Movie, Series, or Both) - if they select specific types, only recommend those types
5. For series recommendations, include the total number of seasons and episodes in the synopsis

Each recommendation must be a JSON object with these exact fields:
- movie_name (string): Full title of the movie/series
- genre (string): Primary genre
- mood (string): The emotional tone of the content
- language (string): Original language
- duration (number): Exact runtime in minutes (for movies) or average episode length (for series)
- platform (string): Where it's available to stream
- cast (array of strings): Main cast members
- crew (object): {director: string, writers: string[]}
- ratings (object): {imdb: string, rottenTomatoes: string}
- synopsis (string): Brief but engaging description (for series, include number of seasons/episodes)
- trailer_link (string): Official trailer URL

Respond with a JSON object containing a "movies" array with exactly 3 movie/series objects.`
          },
          {
            role: 'user',
            content: JSON.stringify(preferences)
          }
        ],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI API');
    }

    const content = response.data.choices[0].message.content;
    const cleanedContent = content.replace(/```json\s*|\s*```/g, '').trim();
    const responseData = JSON.parse(cleanedContent);

    if (!responseData.movies || !Array.isArray(responseData.movies) || responseData.movies.length !== 3) {
      throw new Error('Response must contain a movies array with exactly 3 movies');
    }

    return responseData.movies.map(validateMovieRecommendation);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key and try again.');
      } else if (error.response?.data?.error?.message) {
        throw new Error(`OpenAI API Error: ${error.response.data.error.message}`);
      }
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to get movie recommendations');
  }
}; 