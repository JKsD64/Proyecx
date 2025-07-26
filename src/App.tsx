import React, { useState, useEffect, useMemo } from 'react';
import { FileSpreadsheet, RefreshCw, Moon, Sun } from 'lucide-react';
import { QuotationService } from './services/quotationService';
import { QuotationFilters } from './components/QuotationFilters';
import { QuotationTable } from './components/QuotationTable';
import { QuotationCards } from './components/QuotationCards';
import { ViewToggle } from './components/ViewToggle';
import { QuotationStats } from './components/QuotationStats';
import { Quotation, QuotationFilters as Filters, SortOptions } from './types/quotation';

function App() {
  const [data, setData] = useState<Quotation[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [sortOptions, setSortOptions] = useState<SortOptions>({ field: 'price', order: 'desc' });
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const quotationService = new QuotationService();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Iniciando carga de datos...');
      const quotations = await quotationService.loadData();
      console.log(`Datos cargados: ${quotations.length} cotizaciones`);
      setData(quotations);
    } catch (err) {
      setError('Error al cargar los datos de cotizaciones desde Google Sheets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    const filtered = quotationService.filterData(data, filters);
    return quotationService.sortData(filtered, sortOptions);
  }, [data, filters, sortOptions]);

  const statistics = useMemo(() => {
    return quotationService.getStatistics(filteredData);
  }, [filteredData]);

  const topProviders = useMemo(() => {
    return quotationService.getTopProviders(filteredData, 5);
  }, [filteredData]);

  const topBrands = useMemo(() => {
    return quotationService.getTopBrands(filteredData, 5);
  }, [filteredData]);

  const priceRanges = useMemo(() => {
    return quotationService.getPriceRanges(filteredData);
  }, [filteredData]);

  const uniqueProviders = useMemo(() => {
    return quotationService.getUniqueValues(data, 'Nombre del Proveedor');
  }, [data]);

  const uniqueBrands = useMemo(() => {
    return quotationService.getUniqueValues(data, 'Marca del Componente');
  }, [data]);

  const uniqueTypes = useMemo(() => {
    return quotationService.getUniqueValues(data, 'Tipo de Componente');
  }, [data]);

  const uniqueModels = useMemo(() => {
    return quotationService.getUniqueValues(data, 'Modelo del Componente');
  }, [data]);

  const uniqueDiameters = useMemo(() => {
    return quotationService.getUniqueValues(data, 'Diámetro');
  }, [data]);

  // Datos filtrados para calcular opciones de filtros dinámicos
  const filteredDataForFilters = useMemo(() => {
    // Aplicar todos los filtros excepto el que estamos calculando
    let baseData = data;
    
    if (filters.search) {
      baseData = baseData.filter(row => {
        const searchableText = Object.values(row).join(' ').toLowerCase();
        return searchableText.includes(filters.search!.toLowerCase());
      });
    }
    
    return baseData;
  }, [data, filters.search]);

  const uniqueQuotationTypes = useMemo(() => {
    return quotationService.getUniqueValues(filteredDataForFilters, 'Tipo de item');
  }, [filteredDataForFilters]);

  // Filtros dinámicos basados en la selección actual
  const dynamicUniqueProviders = useMemo(() => {
    let baseData = filteredDataForFilters;
    
    if (filters.marca) baseData = baseData.filter(row => row['Marca del Componente'] === filters.marca);
    if (filters.tipo) baseData = baseData.filter(row => row['Tipo de Componente'] === filters.tipo);
    if (filters.modelo) baseData = baseData.filter(row => row['Modelo del Componente'] === filters.modelo);
    if (filters.diametro) baseData = baseData.filter(row => row['Diámetro'] === filters.diametro);
    if (filters.tipoCotizacion) baseData = baseData.filter(row => row['Tipo de item'] === filters.tipoCotizacion);
    if (filters.year) {
      baseData = baseData.filter(row => {
        const dateStr = row['Fecha y hora'];
        if (dateStr) {
          const parts = dateStr.split('-');
          const year = parts[2] ? parts[2].split(' ')[0] : '';
          return year === filters.year;
        }
        return false;
      });
    }
    
    return quotationService.getUniqueValues(baseData, 'Nombre del Proveedor');
  }, [filteredDataForFilters, filters.marca, filters.tipo, filters.modelo, filters.diametro, filters.tipoCotizacion, filters.year]);

  const dynamicUniqueBrands = useMemo(() => {
    let baseData = filteredDataForFilters;
    
    if (filters.proveedor) baseData = baseData.filter(row => row['Nombre del Proveedor'] === filters.proveedor);
    if (filters.tipo) baseData = baseData.filter(row => row['Tipo de Componente'] === filters.tipo);
    if (filters.modelo) baseData = baseData.filter(row => row['Modelo del Componente'] === filters.modelo);
    if (filters.diametro) baseData = baseData.filter(row => row['Diámetro'] === filters.diametro);
    if (filters.tipoCotizacion) baseData = baseData.filter(row => row['Tipo de item'] === filters.tipoCotizacion);
    if (filters.year) {
      baseData = baseData.filter(row => {
        const dateStr = row['Fecha y hora'];
        if (dateStr) {
          const parts = dateStr.split('-');
          const year = parts[2] ? parts[2].split(' ')[0] : '';
          return year === filters.year;
        }
        return false;
      });
    }
    
    return quotationService.getUniqueValues(baseData, 'Marca del Componente');
  }, [filteredDataForFilters, filters.proveedor, filters.tipo, filters.modelo, filters.diametro, filters.tipoCotizacion, filters.year]);

  const dynamicUniqueTypes = useMemo(() => {
    let baseData = filteredDataForFilters;
    
    if (filters.proveedor) baseData = baseData.filter(row => row['Nombre del Proveedor'] === filters.proveedor);
    if (filters.marca) baseData = baseData.filter(row => row['Marca del Componente'] === filters.marca);
    if (filters.modelo) baseData = baseData.filter(row => row['Modelo del Componente'] === filters.modelo);
    if (filters.diametro) baseData = baseData.filter(row => row['Diámetro'] === filters.diametro);
    if (filters.tipoCotizacion) baseData = baseData.filter(row => row['Tipo de item'] === filters.tipoCotizacion);
    if (filters.year) {
      baseData = baseData.filter(row => {
        const dateStr = row['Fecha y hora'];
        if (dateStr) {
          const parts = dateStr.split('-');
          const year = parts[2] ? parts[2].split(' ')[0] : '';
          return year === filters.year;
        }
        return false;
      });
    }
    
    return quotationService.getUniqueValues(baseData, 'Tipo de Componente');
  }, [filteredDataForFilters, filters.proveedor, filters.marca, filters.modelo, filters.diametro, filters.tipoCotizacion, filters.year]);

  const dynamicUniqueModels = useMemo(() => {
    let baseData = filteredDataForFilters;
    
    if (filters.proveedor) baseData = baseData.filter(row => row['Nombre del Proveedor'] === filters.proveedor);
    if (filters.marca) baseData = baseData.filter(row => row['Marca del Componente'] === filters.marca);
    if (filters.tipo) baseData = baseData.filter(row => row['Tipo de Componente'] === filters.tipo);
    if (filters.diametro) baseData = baseData.filter(row => row['Diámetro'] === filters.diametro);
    if (filters.tipoCotizacion) baseData = baseData.filter(row => row['Tipo de item'] === filters.tipoCotizacion);
    if (filters.year) {
      baseData = baseData.filter(row => {
        const dateStr = row['Fecha y hora'];
        if (dateStr) {
          const parts = dateStr.split('-');
          const year = parts[2] ? parts[2].split(' ')[0] : '';
          return year === filters.year;
        }
        return false;
      });
    }
    
    return quotationService.getUniqueValues(baseData, 'Modelo del Componente');
  }, [filteredDataForFilters, filters.proveedor, filters.marca, filters.tipo, filters.diametro, filters.tipoCotizacion, filters.year]);

  const dynamicUniqueDiameters = useMemo(() => {
    let baseData = filteredDataForFilters;
    
    if (filters.proveedor) baseData = baseData.filter(row => row['Nombre del Proveedor'] === filters.proveedor);
    if (filters.marca) baseData = baseData.filter(row => row['Marca del Componente'] === filters.marca);
    if (filters.tipo) baseData = baseData.filter(row => row['Tipo de Componente'] === filters.tipo);
    if (filters.modelo) baseData = baseData.filter(row => row['Modelo del Componente'] === filters.modelo);
    if (filters.tipoCotizacion) baseData = baseData.filter(row => row['Tipo de item'] === filters.tipoCotizacion);
    if (filters.year) {
      baseData = baseData.filter(row => {
        const dateStr = row['Fecha y hora'];
        if (dateStr) {
          const parts = dateStr.split('-');
          const year = parts[2] ? parts[2].split(' ')[0] : '';
          return year === filters.year;
        }
        return false;
      });
    }
    
    return quotationService.getUniqueValues(baseData, 'Diámetro');
  }, [filteredDataForFilters, filters.proveedor, filters.marca, filters.tipo, filters.modelo, filters.tipoCotizacion, filters.year]);

  const dynamicUniqueQuotationTypes = useMemo(() => {
    let baseData = filteredDataForFilters;
    
    if (filters.proveedor) baseData = baseData.filter(row => row['Nombre del Proveedor'] === filters.proveedor);
    if (filters.marca) baseData = baseData.filter(row => row['Marca del Componente'] === filters.marca);
    if (filters.tipo) baseData = baseData.filter(row => row['Tipo de Componente'] === filters.tipo);
    if (filters.modelo) baseData = baseData.filter(row => row['Modelo del Componente'] === filters.modelo);
    if (filters.diametro) baseData = baseData.filter(row => row['Diámetro'] === filters.diametro);
    if (filters.year) {
      baseData = baseData.filter(row => {
        const dateStr = row['Fecha y hora'];
        if (dateStr) {
          const parts = dateStr.split('-');
          const year = parts[2] ? parts[2].split(' ')[0] : '';
          return year === filters.year;
        }
        return false;
      });
    }
    
    return quotationService.getUniqueValues(baseData, 'Tipo de item');
  }, [filteredDataForFilters, filters.proveedor, filters.marca, filters.tipo, filters.modelo, filters.diametro, filters.year]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Apply dark mode class on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <RefreshCw className="w-8 h-8 text-white animate-spin" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 animate-pulse"></div>
          </div>
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Cargando Cotizaciones
          </h3>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
            Conectando con Google Sheets...
          </p>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-red-50 via-white to-orange-50'} flex items-center justify-center`}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileSpreadsheet className="w-8 h-8 text-white" />
          </div>
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Error de Conexión
          </h3>
          <div className={`${darkMode ? 'bg-red-900/50 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-700'} border rounded-xl px-6 py-4 mb-6`}>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={loadData}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Reintentar Conexión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Header */}
      <header className={`${
        darkMode 
          ? 'bg-gray-800/95 border-gray-700' 
          : 'bg-white/95 border-gray-200'
      } backdrop-blur-sm shadow-lg border-b sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <FileSpreadsheet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Analizador de Cotizaciones
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Sistema profesional de análisis y gestión
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={darkMode ? 'Modo claro' : 'Modo oscuro'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={loadData}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Simplificado */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Cotizaciones - KPI Principal */}
          <div className={`${
            darkMode 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/80 border-gray-200'
          } backdrop-blur-sm rounded-2xl shadow-xl border p-6 md:col-span-1`}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileSpreadsheet className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total de Cotizaciones
                </p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {statistics.totalItems.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Top Proveedores - Compacto */}
          <div className={`${
            darkMode 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/80 border-gray-200'
          } backdrop-blur-sm rounded-2xl shadow-xl border p-6`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center`}>
              <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-2"></div>
              Top Proveedores
            </h3>
            <div className="space-y-2">
              {topProviders.slice(0, 3).map((provider, index) => (
                <div key={provider.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`w-6 h-6 ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    } text-white rounded-full flex items-center justify-center text-xs font-bold mr-3`}>
                      {index + 1}
                    </span>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                      {provider.name}
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {provider.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Distribución de Precios - Compacto */}
          <div className={`${
            darkMode 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/80 border-gray-200'
          } backdrop-blur-sm rounded-2xl shadow-xl border p-6`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center`}>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2"></div>
              Rangos de Precio
            </h3>
            <div className="space-y-2">
              {Object.entries(priceRanges).slice(0, 3).map(([range, count]) => {
                const total = Object.values(priceRanges).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                return (
                  <div key={range} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        ${range.replace('-', ' - $').replace('+', '+')}
                      </span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {count}
                      </span>
                    </div>
                    <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5`}>
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Estadísticas completas - Solo si se necesitan */}
        <div className="mb-8 hidden">
          <QuotationStats
            statistics={statistics}
            topProviders={topProviders}
            topBrands={topBrands}
            priceRanges={priceRanges}
          />
        </div>

        {/* Filtros */}
        <div className="space-y-6">
          <QuotationFilters
            darkMode={darkMode}
            filters={filters}
            onFiltersChange={setFilters}
            sortOptions={sortOptions}
            onSortChange={setSortOptions}
            data={data}
            uniqueProviders={dynamicUniqueProviders}
            uniqueBrands={dynamicUniqueBrands}
            uniqueTypes={dynamicUniqueTypes}
            uniqueModels={dynamicUniqueModels}
            uniqueDiameters={dynamicUniqueDiameters}
            uniqueQuotationTypes={dynamicUniqueQuotationTypes}
          />

          {/* View Toggle */}
          <div className="flex justify-end">
            <ViewToggle
              darkMode={darkMode}
              currentView={viewMode}
              onViewChange={setViewMode}
            />
          </div>
        </div>

        {/* Data Display */}
        {viewMode === 'table' ? (
          <QuotationTable
            darkMode={darkMode}
            data={filteredData}
          />
        ) : (
          <QuotationCards
            darkMode={darkMode}
            data={filteredData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={`${
        darkMode 
          ? 'bg-gray-800/95 border-gray-700' 
          : 'bg-white/95 border-gray-200'
      } backdrop-blur-sm border-t mt-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p className="flex items-center justify-center">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-2"></span>
              Sistema de Análisis de Cotizaciones - Desarrollado con React y TypeScript
            </p>
            <p className="mt-1">
              Mostrando <span className="font-semibold">{filteredData.length.toLocaleString()}</span> de <span className="font-semibold">{data.length.toLocaleString()}</span> cotizaciones
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;