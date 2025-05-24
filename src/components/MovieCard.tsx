import React from 'react';
import { motion } from 'framer-motion';
import { MovieCardProps } from '../types';
import { StarIcon, ClockIcon, FilmIcon } from '@heroicons/react/24/solid';

export const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="movie-card"
      onClick={onClick}
    >
      <h3 className="text-xl font-bold mb-2">{movie.movie_name}</h3>
      
      <div className="flex gap-2 mb-3">
        <span className="chip">{movie.genre}</span>
        <span className="chip">{movie.language}</span>
      </div>

      <div className="flex items-center gap-4 mb-3 text-cinematic-text-secondary">
        <div className="flex items-center gap-1">
          <StarIcon className="w-5 h-5 text-yellow-500" />
          <span>{movie.ratings.imdb}</span>
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-5 h-5" />
          <span>{movie.duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <FilmIcon className="w-5 h-5" />
          <span>{movie.platform}</span>
        </div>
      </div>

      <p className="text-sm text-cinematic-text-secondary line-clamp-2">
        {movie.synopsis}
      </p>

      <div className="mt-4">
        <p className="text-sm">
          <span className="text-cinematic-text-secondary">Director: </span>
          {movie.crew.director}
        </p>
        <p className="text-sm">
          <span className="text-cinematic-text-secondary">Cast: </span>
          {movie.cast.slice(0, 3).join(', ')}
          {movie.cast.length > 3 ? '...' : ''}
        </p>
      </div>
    </motion.div>
  );
}; 