import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { MovieRecommendation } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface MovieModalProps {
  movie: MovieRecommendation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MovieModal = ({ movie, isOpen, onClose }: MovieModalProps) => {
  if (!movie) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-cinematic-card p-6 shadow-xl transition-all">
                <div className="absolute right-4 top-4">
                  <button
                    onClick={onClose}
                    className="text-cinematic-text-secondary hover:text-cinematic-text"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <Dialog.Title as="h3" className="text-2xl font-bold mb-4">
                  {movie.movie_name}
                </Dialog.Title>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="chip">{movie.genre}</span>
                    <span className="chip">{movie.language}</span>
                    <span className="chip">{movie.duration}</span>
                    <span className="chip">{movie.platform}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-cinematic-text-secondary mb-1">
                        Ratings
                      </h4>
                      <div className="space-y-1">
                        <p>IMDb: {movie.ratings.imdb}</p>
                        <p>Rotten Tomatoes: {movie.ratings.rottenTomatoes}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-cinematic-text-secondary mb-1">
                        Crew
                      </h4>
                      <div className="space-y-1">
                        <p>Director: {movie.crew.director}</p>
                        <p>Writers: {movie.crew.writers.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-cinematic-text-secondary mb-1">
                      Cast
                    </h4>
                    <p>{movie.cast.join(', ')}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-cinematic-text-secondary mb-1">
                      Synopsis
                    </h4>
                    <p className="text-cinematic-text-secondary">{movie.synopsis}</p>
                  </div>

                  <div className="pt-4">
                    <a
                      href={movie.trailer_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-block"
                    >
                      Watch Trailer
                    </a>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}; 