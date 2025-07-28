import React from 'react';
import { Calendar, MapPin, User, AlertTriangle, Clock, Eye } from 'lucide-react';
import { MaintenanceEvent } from '../types/event';

interface EventListProps {
  darkMode: boolean;
  events: MaintenanceEvent[];
  selectedEvent: MaintenanceEvent | null;
  onEventSelect: (event: MaintenanceEvent) => void;
}

export const EventList: React.FC<EventListProps> = ({
  darkMode,
  events,
  selectedEvent,
  onEventSelect
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Crítica':
        return darkMode 
          ? 'bg-red-900/50 text-red-300 border-red-700' 
          : 'bg-red-100 text-red-800 border-red-200';
      case 'Alta':
        return darkMode 
          ? 'bg-orange-900/50 text-orange-300 border-orange-700' 
          : 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Media':
        return darkMode 
          ? 'bg-yellow-900/50 text-yellow-300 border-yellow-700' 
          : 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Baja':
        return darkMode 
          ? 'bg-green-900/50 text-green-300 border-green-700' 
          : 'bg-green-100 text-green-800 border-green-200';
      default:
        return darkMode 
          ? 'bg-gray-900/50 text-gray-300 border-gray-700' 
          : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado':
        return darkMode 
          ? 'bg-green-900/50 text-green-300 border-green-700' 
          : 'bg-green-100 text-green-800 border-green-200';
      case 'En Progreso':
        return darkMode 
          ? 'bg-blue-900/50 text-blue-300 border-blue-700' 
          : 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pendiente':
        return darkMode 
          ? 'bg-gray-900/50 text-gray-300 border-gray-700' 
          : 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return darkMode 
          ? 'bg-gray-900/50 text-gray-300 border-gray-700' 
          : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (events.length === 0) {
    return (
      <div className={`${
        darkMode 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      } backdrop-blur-sm rounded-2xl shadow-xl border p-8 text-center`}>
        <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
          No se encontraron eventos
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Intenta ajustar los filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className={`${
      darkMode 
        ? 'bg-gray-800/50 border-gray-700' 
        : 'bg-white/80 border-gray-200'
    } backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden`}>
      <div className={`px-6 py-4 border-b flex justify-between items-center ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Eventos de Mantenimiento ({events.length} resultados)
        </h2>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {events.map((event, index) => (
            <div
              key={index}
              onClick={() => onEventSelect(event)}
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedEvent === event
                  ? darkMode 
                    ? 'bg-orange-900/30 border-l-4 border-orange-500' 
                    : 'bg-orange-50 border-l-4 border-orange-500'
                  : darkMode 
                    ? 'hover:bg-gray-700/50' 
                    : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Header con tipo y prioridad */}
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      getPriorityColor(event.Prioridad)
                    }`}>
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {event.Prioridad}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      getStatusColor(event.Estado)
                    }`}>
                      <Clock className="w-3 h-3 mr-1" />
                      {event.Estado}
                    </span>
                  </div>

                  {/* Título del problema */}
                  <h3 className={`text-sm font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  } mb-2 line-clamp-2`}>
                    {event['Descripción del problema']}
                  </h3>

                  {/* Información básica */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {event.Fecha} {event.Hora}
                      </span>
                    </div>
                    
                    <div className={`flex items-center ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{event.Ubicación}</span>
                    </div>
                    
                    <div className={`flex items-center ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <User className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{event.Responsable}</span>
                    </div>
                    
                    <div className={`flex items-center ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <span className="w-3 h-3 mr-1 flex-shrink-0 text-center">📋</span>
                      <span className="truncate">{event['Tipo de evento']}</span>
                    </div>
                  </div>
                </div>

                {/* Botón de ver detalles */}
                <div className="ml-4 flex-shrink-0">
                  <button className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}>
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};