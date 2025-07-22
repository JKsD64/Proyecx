import React from 'react';
import { Grid3X3, Table } from 'lucide-react';

interface ViewToggleProps {
  currentView: 'table' | 'cards';
  onViewChange: (view: 'table' | 'cards') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      <button
        onClick={() => onViewChange('cards')}
        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          currentView === 'cards'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <Grid3X3 className="w-4 h-4 mr-2" />
        Tarjetas
      </button>
      <button
        onClick={() => onViewChange('table')}
        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          currentView === 'table'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <Table className="w-4 h-4 mr-2" />
        Tabla
      </button>
    </div>
  );
};