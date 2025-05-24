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
            content: `You are a movie recommendation assistant. Given mood, genre, language, duration, and streaming platforms, recommend exactly 3 movies. Each movie must be a JSON object with these exact fields: movie_name (string), genre (string), mood (string), language (string), duration (number - exact minutes), platform (string), cast (array of strings), crew (object with director string and writers array), ratings (object with imdb string and rottenTomatoes string), synopsis (string), and trailer_link (string). Respond with a JSON object containing a "movies" array with exactly 3 movie objects.`
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