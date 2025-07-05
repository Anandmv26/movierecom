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
    duration: 'string',
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
  }

  if (!movie.duration || typeof movie.duration !== 'string') {
    throw new Error('Duration must be a non-empty string');
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
    duration: movie.duration
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
            content: `You are a movie and series recommendation assistant. Based on the user's mood, content type (movie, series, or both), language, and streaming platforms, recommend exactly 3 titles.

            Follow this mood-to-content mapping:
            - Sad → uplifting, feel-good stories
            - Happy → light, joyful, entertaining content
            - Excited → thrilling, action-packed, high-energy titles
            - Calm → peaceful, relaxing, or meditative content
            - Curious → thought-provoking, mysterious, or intellectual stories
            
            Requirements:
            - Only include content available on the specified platforms (Netflix, Amazon Prime, Hotstar, Sony LIV, Zee5, Others)
            - Match the selected content type (movie, series, or both)
            - Match the selected language (English, Hindi, Tamil, Telugu, Malayalam)
            - Ensure variety (no duplicates or direct sequels)
            - For series, include number of seasons, episodes, and average episode length in the synopsis
            - The \`trailer_link\` must be a valid **official YouTube trailer URL**
            - The \`duration\` must be a string:
              - For movies → use total runtime (e.g., "120 mins")
              - For series → use format like "2 seasons, 16 episodes, ~40 mins each"
            
            Respond only with valid JSON in this format:
            {
              "movies": [
                {
                  "movie_name": "string",
                  "genre": "string",
                  "mood": "string",
                  "language": "string",
                  "duration": "string",  // e.g., "120 mins" or "2 seasons, 16 episodes, ~40 mins each"
                  "platform": "string",
                  "cast": ["string", "string"],
                  "crew": {
                    "director": "string",
                    "writers": ["string", "string"]
                  },
                  "ratings": {
                    "imdb": "string",
                    "rottenTomatoes": "string"
                  },
                  "synopsis": "string",
                  "trailer_link": "string"
                },
                // 2 more
              ]
            }`
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