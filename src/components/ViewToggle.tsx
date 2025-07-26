import React from 'react';
import { Grid3X3, Table } from 'lucide-react';

interface ViewToggleProps {
  darkMode: boolean;
  currentView: 'table' | 'cards';
  onViewChange: (view: 'table' | 'cards') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ darkMode, currentView, onViewChange }) => {
  return (
    <div className={`flex items-center rounded-xl shadow-lg border p-1 ${
      darkMode 
        ? 'bg-gray-800/50 border-gray-700' 
        : 'bg-white/80 border-gray-200'
    } backdrop-blur-sm`}>
      <button
        onClick={() => onViewChange('cards')}
        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          currentView === 'cards'
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
            : darkMode 
              ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <Grid3X3 className="w-4 h-4 mr-2" />
        Tarjetas
      </button>
      <button
        onClick={() => onViewChange('table')}
        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          currentView === 'table'
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
            : darkMode 
              ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <Table className="w-4 h-4 mr-2" />
        Tabla
      </button>
    </div>
  );
};