import React from 'react';
import { Download, Eye, Calendar, Package, Building, Tag } from 'lucide-react';
import { Quotation } from '../types/quotation';
import { QuotationDetailModal } from './QuotationDetailModal';

interface QuotationTableProps {
  data: Quotation[];
  onExport: () => void;
}

export const QuotationTable: React.FC<QuotationTableProps> = ({ data, onExport }) => {
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
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron cotizaciones</h3>
        <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Cotizaciones ({data.length} resultados)
        </h2>
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Fecha
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  Producto
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  Proveedor
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  Marca/Tipo
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Unit.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entrega
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(row['Fecha y hora'])}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div className="truncate" title={row['Descripción del Producto - Resumida']}>
                    {row['Descripción del Producto - Resumida']}
                  </div>
                  {row['Modelo del Componente'] && row['Modelo del Componente'] !== 'No aplica' && (
                    <div className="text-xs text-gray-500 truncate">
                      Modelo: {row['Modelo del Componente']}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row['Nombre del Proveedor']}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="space-y-1">
                    {row['Marca del Componente'] && row['Marca del Componente'] !== 'No aplica' && (
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {row['Marca del Componente']}
                      </div>
                    )}
                    {row['Tipo de Componente'] && row['Tipo de Componente'] !== 'No aplica' && (
                      <div className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {row['Tipo de Componente']}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatPrice(row['Precio Unitario Neto en CLP'])}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row['Cantidad']}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  {formatPrice(row['Precio Total Neto en CLP'])}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row['Plazo de entrega']}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleViewDetails(row)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
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
      />
    </div>
  );
};