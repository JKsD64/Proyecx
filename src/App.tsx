import React, { useState, useEffect, useMemo } from 'react';
import { FileSpreadsheet, RefreshCw } from 'lucide-react';
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

  const uniqueQuotationTypes = useMemo(() => {
    return quotationService.getUniqueValues(data, 'Tipo de item');
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos desde Google Sheets...</p>
          <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={loadData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <FileSpreadsheet className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Analizador de Cotizaciones</h1>
                <p className="text-sm text-gray-500">Sistema de análisis y gestión de cotizaciones</p>
              </div>
            </div>
            <button
              onClick={loadData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="mb-8">
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
            filters={filters}
            onFiltersChange={setFilters}
            sortOptions={sortOptions}
            onSortChange={setSortOptions}
            data={data}
            uniqueProviders={uniqueProviders}
            uniqueBrands={uniqueBrands}
            uniqueTypes={uniqueTypes}
            uniqueModels={uniqueModels}
            uniqueDiameters={uniqueDiameters}
            uniqueQuotationTypes={uniqueQuotationTypes}
          />

          {/* View Toggle */}
          <div className="flex justify-end">
            <ViewToggle
              currentView={viewMode}
              onViewChange={setViewMode}
            />
          </div>
        </div>

        {/* Data Display */}
        {viewMode === 'table' ? (
          <QuotationTable
            data={filteredData}
          />
        ) : (
          <QuotationCards
            data={filteredData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Sistema de Análisis de Cotizaciones - Desarrollado con React y TypeScript</p>
            <p className="mt-1">
              Mostrando {filteredData.length} de {data.length} cotizaciones
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;