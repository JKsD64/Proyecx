import React from 'react';
import { Search, Filter, Calendar, ArrowUpDown } from 'lucide-react';
import { QuotationFilters as Filters, Quotation, SortOptions } from '../types/quotation';

interface QuotationFiltersProps {
  darkMode: boolean;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  sortOptions: SortOptions;
  onSortChange: (sort: SortOptions) => void;
  data: Quotation[];
  uniqueProviders: string[];
  uniqueBrands: string[];
  uniqueTypes: string[];
  uniqueModels: string[];
  uniqueDiameters: string[];
  uniqueQuotationTypes: string[];
}

export const QuotationFilters: React.FC<QuotationFiltersProps> = ({
  darkMode,
  filters,
  onFiltersChange,
  sortOptions,
  onSortChange,
  uniqueProviders,
  uniqueBrands,
  uniqueTypes,
  uniqueModels,
  uniqueDiameters,
  uniqueQuotationTypes
}) => {
  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const handleSortChange = (field: 'price' | 'alphabetical', order: 'asc' | 'desc') => {
    onSortChange({ field, order });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className={`${
      darkMode 
        ? 'bg-gray-800/50 border-gray-700' 
        : 'bg-white/80 border-gray-200'
    } backdrop-blur-sm rounded-2xl shadow-xl border p-6 mb-6 space-y-6`}>
      {/* Header con filtros y ordenamiento */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
              <Filter className="w-4 h-4 text-white" />
            </div>
            Filtros de Búsqueda
          </h2>
          
          {/* Controles de ordenamiento */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Ordenar por:
            </span>
            
            <select
              value={`${sortOptions.field}-${sortOptions.order}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-') as ['price' | 'alphabetical', 'asc' | 'desc'];
                handleSortChange(field, order);
              }}
              className={`text-sm px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="alphabetical-asc">Alfabético: A-Z</option>
              <option value="alphabetical-desc">Alfabético: Z-A</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={clearFilters}
          className={`text-sm px-4 py-2 rounded-xl transition-all duration-200 ${
            darkMode 
              ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-700' 
              : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
          }`}
        >
          Limpiar Filtros
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Búsqueda general */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Buscar en todos los campos..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        {/* Proveedor */}
        <select
          value={filters.proveedor || ''}
          onChange={(e) => handleFilterChange('proveedor', e.target.value)}
          className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
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
          className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
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
          className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="">Todos los tipos</option>
          {uniqueTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Tipo de cotización */}
        <select
          value={filters.tipoCotizacion || ''}
          onChange={(e) => handleFilterChange('tipoCotizacion', e.target.value)}
          className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="">Todos los tipos de cotización</option>
          {uniqueQuotationTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Modelo */}
        <select
          value={filters.modelo || ''}
          onChange={(e) => handleFilterChange('modelo', e.target.value)}
          className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
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
          className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="">Todos los diámetros</option>
          {uniqueDiameters.map(diameter => (
            <option key={diameter} value={diameter}>{diameter}</option>
          ))}
        </select>

        {/* Año */}
        <div className="relative">
          <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <select
            value={filters.year || ''}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
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