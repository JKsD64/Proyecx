import React from 'react';
import { 
  Calendar, 
  MapPin, 
  User, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  FileText, 
  Wrench,
  CheckCircle,
  XCircle,
  PlayCircle
} from 'lucide-react';
import { MaintenanceEvent } from '../types/event';
import { EventService } from '../services/eventService';

interface EventDetailProps {
  darkMode: boolean;
  event: MaintenanceEvent | null;
}

export const EventDetail: React.FC<EventDetailProps> = ({ darkMode, event }) => {
  const eventService = new EventService();

  if (!event) {
    return (
      <div className={`${
        darkMode 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      } backdrop-blur-sm rounded-2xl shadow-xl border p-8 text-center`}>
        <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
          Selecciona un evento
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Elige un evento de la lista para ver sus detalles completos
        </p>
      </div>
    );
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completado':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'En Progreso':
        return <PlayCircle className="w-5 h-5 text-blue-500" />;
      case 'Pendiente':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const DetailRow: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    value: string;
    fullWidth?: boolean;
  }> = ({ icon, label, value, fullWidth = false }) => (
    <div className={`${fullWidth ? 'col-span-2' : ''} space-y-1`}>
      <div className={`flex items-center text-xs font-medium ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {icon}
        <span className="ml-1">{label}</span>
      </div>
      <div className={`text-sm ${
        darkMode ? 'text-gray-200' : 'text-gray-900'
      } ${fullWidth ? 'break-words' : ''}`}>
        {value || 'No especificado'}
      </div>
    </div>
  );

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
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                getPriorityColor(event.Prioridad)
              }`}>
                <AlertTriangle className="w-4 h-4 mr-1" />
                {event.Prioridad}
              </span>
              <div className="flex items-center">
                {getStatusIcon(event.Estado)}
                <span className={`ml-2 text-sm font-medium ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {event.Estado}
                </span>
              </div>
            </div>
            <h2 className={`text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {event['Descripción del problema']}
            </h2>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            } mt-1`}>
              {event['Tipo de evento']} - {event.Fecha} {event.Hora}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Información básica */}
        <div>
          <h3 className={`text-sm font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          } mb-3 flex items-center`}>
            <FileText className="w-4 h-4 mr-2" />
            Información General
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <DetailRow
              icon={<Calendar className="w-3 h-3" />}
              label="Fecha y Hora"
              value={`${event.Fecha} ${event.Hora}`}
            />
            <DetailRow
              icon={<MapPin className="w-3 h-3" />}
              label="Ubicación"
              value={event.Ubicación}
            />
            <DetailRow
              icon={<User className="w-3 h-3" />}
              label="Responsable"
              value={event.Responsable}
            />
            <DetailRow
              icon={<Wrench className="w-3 h-3" />}
              label="Tipo de Evento"
              value={event['Tipo de evento']}
            />
          </div>
        </div>

        {/* Descripción del problema */}
        <div>
          <h3 className={`text-sm font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          } mb-3 flex items-center`}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Descripción del Problema
          </h3>
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <p className={`text-sm ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {event['Descripción del problema']}
            </p>
          </div>
        </div>

        {/* Tiempos y costos */}
        <div>
          <h3 className={`text-sm font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          } mb-3 flex items-center`}>
            <Clock className="w-4 h-4 mr-2" />
            Tiempos y Costos
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <DetailRow
              icon={<Clock className="w-3 h-3" />}
              label="Tiempo Estimado"
              value={`${event['Tiempo estimado (horas)']} horas`}
            />
            <DetailRow
              icon={<Clock className="w-3 h-3" />}
              label="Tiempo Real"
              value={`${event['Tiempo real (horas)']} horas`}
            />
            <DetailRow
              icon={<DollarSign className="w-3 h-3" />}
              label="Costo Estimado"
              value={eventService.formatCurrency(event['Costo estimado'])}
            />
            <DetailRow
              icon={<DollarSign className="w-3 h-3" />}
              label="Costo Real"
              value={eventService.formatCurrency(event['Costo real'])}
            />
          </div>
        </div>

        {/* Solución y materiales */}
        {(event['Descripción de la solución'] || event['Materiales utilizados']) && (
          <div>
            <h3 className={`text-sm font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            } mb-3 flex items-center`}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Solución Implementada
            </h3>
            <div className="space-y-4">
              {event['Descripción de la solución'] && (
                <div>
                  <h4 className={`text-xs font-medium ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  } mb-2`}>
                    Descripción de la Solución
                  </h4>
                  <div className={`p-4 rounded-xl ${
                    darkMode ? 'bg-green-900/20' : 'bg-green-50'
                  }`}>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      {event['Descripción de la solución']}
                    </p>
                  </div>
                </div>
              )}
              
              {event['Materiales utilizados'] && (
                <DetailRow
                  icon={<Wrench className="w-3 h-3" />}
                  label="Materiales Utilizados"
                  value={event['Materiales utilizados']}
                  fullWidth
                />
              )}
            </div>
          </div>
        )}

        {/* Observaciones */}
        {event.Observaciones && (
          <div>
            <h3 className={`text-sm font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            } mb-3 flex items-center`}>
              <FileText className="w-4 h-4 mr-2" />
              Observaciones
            </h3>
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
            }`}>
              <p className={`text-sm ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {event.Observaciones}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};