import React from 'react';
import { Eye, Calendar, Package, Building, Tag } from 'lucide-react';
import { Quotation } from '../types/quotation';
import { QuotationDetailModal } from './QuotationDetailModal';

interface QuotationTableProps {
  darkMode: boolean;
  data: Quotation[];
}

export const QuotationTable: React.FC<QuotationTableProps> = ({ darkMode, data }) => {
  const [selectedQuotation, setSelectedQuotation] = React.useState<Quotation | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num)) return 'N/A';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(num);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const parts = dateStr.split(' ');
    return parts[0] || dateStr;
  };

  const handleViewDetails = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuotation(null);
  };

  if (data.length === 0) {
    return (
      <div className={`${
        darkMode 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      } backdrop-blur-sm rounded-2xl shadow-xl border p-8 text-center`}>
        <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
          No se encontraron cotizaciones
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
          Cotizaciones ({data.length} resultados)
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Fecha
                </div>
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  Producto
                </div>
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  Proveedor
                </div>
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  Marca/Tipo
                </div>
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Precio Unit.
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Cantidad
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Total
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Entrega
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            darkMode 
              ? 'bg-gray-800/30 divide-gray-700' 
              : 'bg-white divide-gray-200'
          }`}>
            {data.map((row, index) => (
              <tr key={index} className={`transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700/50' 
                  : 'hover:bg-gray-50'
              }`}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {formatDate(row['Fecha y hora'])}
                </td>
                <td className={`px-6 py-4 text-sm max-w-xs ${
                  darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  <div className="truncate" title={row['Descripción del Producto - Resumida']}>
                    {row['Descripción del Producto - Resumida']}
                  </div>
                  {row['Modelo del Componente'] && row['Modelo del Componente'] !== 'No aplica' && (
                    <div className={`text-xs truncate ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Modelo: {row['Modelo del Componente']}
                    </div>
                  )}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {row['Nombre del Proveedor']}
                </td>
                <td className={`px-6 py-4 text-sm ${
                  darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  <div className="space-y-1">
                    {row['Marca del Componente'] && row['Marca del Componente'] !== 'No aplica' && (
                      <div className={`text-xs px-2 py-1 rounded ${
                        darkMode 
                          ? 'bg-blue-900/50 text-blue-300 border border-blue-700' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {row['Marca del Componente']}
                      </div>
                    )}
                    {row['Tipo de Componente'] && row['Tipo de Componente'] !== 'No aplica' && (
                      <div className={`text-xs px-2 py-1 rounded ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {row['Tipo de Componente']}
                      </div>
                    )}
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {formatPrice(row['Precio Unitario Neto en CLP'])}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {row['Cantidad']}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  {formatPrice(row['Precio Total Neto en CLP'])}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {row['Plazo de entrega']}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <button
                    onClick={() => handleViewDetails(row)}
                    className={`font-medium transition-colors ${
                      darkMode 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <QuotationDetailModal
        quotation={selectedQuotation}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        darkMode={darkMode}
      />
    </div>
  );
};