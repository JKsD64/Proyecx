import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { QuotationFilters as Filters, Quotation } from '../types/quotation';

interface QuotationFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  data: Quotation[];
  uniqueProviders: string[];
  uniqueBrands: string[];
  uniqueTypes: string[];
  uniqueModels: string[];
  uniqueDiameters: string[];
}

export const QuotationFilters: React.FC<QuotationFiltersProps> = ({
  filters,
  onFiltersChange,
  uniqueProviders,
  uniqueBrands,
  uniqueTypes,
  uniqueModels,
  uniqueDiameters
}) => {
  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtros de Búsqueda
        </h2>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Limpiar Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Búsqueda general */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar en todos los campos..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Proveedor */}
        <select
          value={filters.proveedor || ''}
          onChange={(e) => handleFilterChange('proveedor', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los proveedores</option>
          {uniqueProviders.map(provider => (
            <option key={provider} value={provider}>{provider}</option>
          ))}
        </select>

        {/* Marca */}
        <select
          value={filters.marca || ''}
          onChange={(e) => handleFilterChange('marca', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todas las marcas</option>
          {uniqueBrands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        {/* Tipo de componente */}
        <select
          value={filters.tipo || ''}
          onChange={(e) => handleFilterChange('tipo', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los tipos</option>
          {uniqueTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Modelo */}
        <select
          value={filters.modelo || ''}
          onChange={(e) => handleFilterChange('modelo', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los modelos</option>
          {uniqueModels.map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>

        {/* Diámetro */}
        <select
          value={filters.diametro || ''}
          onChange={(e) => handleFilterChange('diametro', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los diámetros</option>
          {uniqueDiameters.map(diameter => (
            <option key={diameter} value={diameter}>{diameter}</option>
          ))}
        </select>

        {/* Año */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={filters.year || ''}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los años</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>
    </div>
  );
};