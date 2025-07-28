import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image, Video, Eye, EyeOff } from 'lucide-react';
import { MaintenanceEvent, MediaItem } from '../types/event';
import { EventService } from '../services/eventService';

interface EventComparisonProps {
  darkMode: boolean;
  event: MaintenanceEvent | null;
}

export const EventComparison: React.FC<EventComparisonProps> = ({ darkMode, event }) => {
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(0);
  const [eventImageError, setEventImageError] = useState<Set<number>>(new Set());
  const [solutionImageError, setSolutionImageError] = useState<Set<number>>(new Set());
  const [showComparison, setShowComparison] = useState(true);

  const eventService = new EventService();

  if (!event) {
    return (
      <div className={`${
        darkMode 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      } backdrop-blur-sm rounded-2xl shadow-xl border p-8 text-center`}>
        <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Image className="w-8 h-8 text-white" />
        </div>
        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
          Comparación Visual
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Selecciona un evento para ver la comparación antes/después
        </p>
      </div>
    );
  }

  const { eventMedia, solutionMedia } = eventService.processEventMedia(event);

  const handleEventImageError = (index: number) => {
    setEventImageError(prev => new Set(prev).add(index));
  };

  const handleSolutionImageError = (index: number) => {
    setSolutionImageError(prev => new Set(prev).add(index));
  };

  const MediaViewer: React.FC<{
    media: MediaItem[];
    selectedIndex: number;
    onIndexChange: (index: number) => void;
    title: string;
    color: string;
    errorSet: Set<number>;
    onError: (index: number) => void;
  }> = ({ media, selectedIndex, onIndexChange, title, color, errorSet, onError }) => {
    if (media.length === 0) {
      return (
        <div className={`flex-1 ${
          darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
        } rounded-xl p-8 flex items-center justify-center`}>
          <div className="text-center">
            <Image className={`w-16 h-16 mx-auto mb-4 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              No hay registros multimedia disponibles
            </p>
          </div>
        </div>
      );
    }

    const currentMedia = media[selectedIndex];
    const hasError = errorSet.has(selectedIndex);

    return (
      <div className="flex-1 space-y-4">
        {/* Header con título y controles */}
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          } flex items-center`}>
            <div className={`w-4 h-4 ${color} rounded mr-2`}></div>
            {title}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {selectedIndex + 1} de {media.length}
            </span>
            {media.length > 1 && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onIndexChange(Math.max(0, selectedIndex - 1))}
                  disabled={selectedIndex === 0}
                  className={`p-1 rounded transition-colors ${
                    selectedIndex === 0
                      ? darkMode ? 'text-gray-600' : 'text-gray-400'
                      : darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onIndexChange(Math.min(media.length - 1, selectedIndex + 1))}
                  disabled={selectedIndex === media.length - 1}
                  className={`p-1 rounded transition-colors ${
                    selectedIndex === media.length - 1
                      ? darkMode ? 'text-gray-600' : 'text-gray-400'
                      : darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Visor de medios */}
        <div className={`aspect-video ${
          darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
        } rounded-xl overflow-hidden flex items-center justify-center`}>
          {!hasError && currentMedia ? (
            currentMedia.type === 'video' ? (
              <video
                src={currentMedia.url}
                controls
                className="w-full h-full object-contain"
                onError={() => onError(selectedIndex)}
                preload="metadata"
              >
                Tu navegador no soporta el elemento de video.
              </video>
            ) : (
              <img
                src={currentMedia.url}
                alt={currentMedia.title}
                className="w-full h-full object-contain"
                onError={() => onError(selectedIndex)}
                loading="lazy"
                crossOrigin="anonymous"
              />
            )
          ) : (
            <div className="text-center">
              <Image className={`w-12 h-12 mx-auto mb-2 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {hasError ? 'Error al cargar el archivo' : 'Archivo no disponible'}
              </p>
            </div>
          )}
        </div>

        {/* Título del archivo actual */}
        {currentMedia && (
          <div className="text-center">
            <p className={`text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {currentMedia.title}
            </p>
          </div>
        )}

        {/* Navegación por puntos */}
        {media.length > 1 && (
          <div className="flex justify-center space-x-2">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => onIndexChange(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedIndex
                    ? color.replace('bg-', 'bg-')
                    : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${
      darkMode 
        ? 'bg-gray-800/50 border-gray-700' 
        : 'bg-white/80 border-gray-200'
    } backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${
        darkMode ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50/50'
      }`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          } flex items-center`}>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
              <Eye className="w-4 h-4 text-white" />
            </div>
            Comparación Visual: Antes y Después
          </h2>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            {showComparison ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showComparison ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </div>

      {/* Content */}
      {showComparison && (
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Registro del Problema (Antes) */}
            <MediaViewer
              media={eventMedia}
              selectedIndex={selectedEventIndex}
              onIndexChange={setSelectedEventIndex}
              title="ANTES: Registro del Problema"
              color="bg-red-500"
              errorSet={eventImageError}
              onError={handleEventImageError}
            />

            {/* Separador */}
            <div className="flex lg:flex-col items-center justify-center lg:justify-center">
              <div className={`w-full lg:w-px h-px lg:h-full ${
                darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}></div>
              <div className={`px-4 py-2 lg:px-2 lg:py-4 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-full`}>
                <ChevronRight className={`w-5 h-5 lg:rotate-90 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <div className={`w-full lg:w-px h-px lg:h-full ${
                darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}></div>
            </div>

            {/* Registro de la Solución (Después) */}
            <MediaViewer
              media={solutionMedia}
              selectedIndex={selectedSolutionIndex}
              onIndexChange={setSelectedSolutionIndex}
              title="DESPUÉS: Registro de la Solución"
              color="bg-green-500"
              errorSet={solutionImageError}
              onError={handleSolutionImageError}
            />
          </div>

          {/* Información adicional */}
          {(eventMedia.length > 0 || solutionMedia.length > 0) && (
            <div className={`mt-6 p-4 rounded-xl ${
              darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
            }`}>
              <div className="flex items-center justify-between text-sm">
                <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Registros disponibles:</strong>
                </div>
                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Problema: {eventMedia.length} | Solución: {solutionMedia.length}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};