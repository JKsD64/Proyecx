import React from 'react';
import { Search, Filter, Calendar, DollarSign, Sliders } from 'lucide-react';
import { QuotationFilters as Filters, Quotation } from '../types/quotation';

interface QuotationFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  data: Quotation[];
  uniqueProviders: string[];
  uniqueBrands: string[];
  uniqueTypes: string[];
  uniqueMaterials: string[];
}

export const QuotationFilters: React.FC<QuotationFiltersProps> = ({
  filters,
  onFiltersChange,
  uniqueProviders,
  uniqueBrands,
  uniqueTypes,
  uniqueMaterials
}) => {
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 1000000]);
  const [tempPriceRange, setTempPriceRange] = React.useState<[number, number]>([0, 1000000]);

  // Calculate min and max prices from data for the slider
  React.useEffect(() => {
    // This would need data prop to calculate actual min/max, for now using reasonable defaults
    const minPrice = 0;
    const maxPrice = 1000000;
    setPriceRange([minPrice, maxPrice]);
    setTempPriceRange([minPrice, maxPrice]);
  }, []);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setTempPriceRange([min, max]);
  };

  const applyPriceFilter = () => {
    const [min, max] = tempPriceRange;
    if (min === 0 && max === 1000000) {
      // Remove price filter if it's the full range
      const newFilters = { ...filters };
      delete newFilters.priceRange;
      onFiltersChange(newFilters);
    } else {
      onFiltersChange({
        ...filters,
        priceRange: `${min}-${max}`
      });
    }
  };

  const clearFilters = () => {
    setPriceRange([0, 1000000]);
    setTempPriceRange([0, 1000000]);
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

        {/* Material */}
        <select
          value={filters.material || ''}
          onChange={(e) => handleFilterChange('material', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los materiales</option>
          {uniqueMaterials.map(material => (
            <option key={material} value={material}>{material}</option>
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

        {/* Rango de precios */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={filters.priceRange || ''}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los precios</option>
            <option value="0-10000">$0 - $10,000</option>
            <option value="10000-50000">$10,000 - $50,000</option>
            <option value="50000-100000">$50,000 - $100,000</option>
            <option value="100000-500000">$100,000 - $500,000</option>
            <option value="500000+">$500,000+</option>
          </select>
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            <Sliders className="w-4 h-4 mr-2" />
            Filtro de Precio
          </h3>
          <div className="text-sm text-gray-600">
            ${tempPriceRange[0].toLocaleString('es-CL')} - ${tempPriceRange[1].toLocaleString('es-CL')}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Precio Mínimo</label>
              <input
                type="number"
                value={tempPriceRange[0]}
                onChange={(e) => handlePriceRangeChange(parseInt(e.target.value) || 0, tempPriceRange[1])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                min="0"
                max="1000000"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Precio Máximo</label>
              <input
                type="number"
                value={tempPriceRange[1]}
                onChange={(e) => handlePriceRangeChange(tempPriceRange[0], parseInt(e.target.value) || 1000000)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                min="0"
                max="1000000"
              />
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={applyPriceFilter}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Aplicar Filtro de Precio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};