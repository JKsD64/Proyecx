import React from 'react';
import { Package, Building, Tag, Clock, Hash, FileText, Ruler } from 'lucide-react';
import { Quotation } from '../types/quotation';
import { QuotationDetailModal } from './QuotationDetailModal';

interface QuotationCardsProps {
  data: Quotation[];
}

export const QuotationCards: React.FC<QuotationCardsProps> = ({ data }) => {
  const [selectedQuotation, setSelectedQuotation] = React.useState<Quotation | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [imageErrors, setImageErrors] = React.useState<Set<number>>(new Set());

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

  const getImageUrl = (quotation: Quotation) => {
    // Use the Link Imagen column if available
    const imageLink = quotation['Link Imagen'];
    if (imageLink && imageLink.trim() && imageLink !== 'No aplica' && imageLink !== 'No especificado') {
      return imageLink.trim();
    }
    
    // Fallback to a generic component placeholder
    return null;
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
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
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron cotizaciones</h3>
        <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Cotizaciones ({data.length} resultados)
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((quotation, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            {/* Card Header with PDF badge */}
            <div className="relative p-4 pb-2">
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Package className="w-3 h-3 mr-1" />
                  COTIZACIÓN
                </span>
              </div>
              
              {/* Product Image */}
              <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
                {!imageErrors.has(index) && getImageUrl(quotation) ? (
                  <img
                    src={getImageUrl(quotation)!}
                    alt={quotation['Descripción del Producto - Resumida']}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(index)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Package className="w-8 h-8 mx-auto mb-1" />
                      <span className="text-xs">Componente</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="px-4 pb-4">
              {/* Product Title */}
              <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                {quotation['Descripción del Producto - Resumida']}
              </h3>

              {/* Price */}
              <div className="text-2xl font-bold text-blue-600 mb-3">
                {formatPrice(quotation['Precio Unitario Neto en CLP'])}
                {quotation['Cantidad'] && quotation['Cantidad'] !== '1' && (
                  <span className="text-sm text-gray-500 ml-1">x{quotation['Cantidad']}</span>
                )}
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium text-right">
                    {quotation['Tipo de Componente'] || 'No especificado'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Marca:</span>
                  <span className="font-medium text-right">
                    {quotation['Marca del Componente'] || 'No especificado'}
                  </span>
                </div>
                
                {quotation['Modelo del Componente'] && quotation['Modelo del Componente'] !== 'No aplica' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Modelo:</span>
                    <span className="font-medium text-right truncate ml-2">
                      {quotation['Modelo del Componente']}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Diámetro:</span>
                  <span className="font-medium text-right">
                    {quotation['Diámetro'] || 'No especificado'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Archivo:</span>
                  <span className="font-medium text-right truncate ml-2">
                    {quotation['Nombre del archivo'] || 'No especificado'}
                  </span>
                </div>
              </div>

              {/* Provider Badge */}
              <div className="mt-3 flex items-center text-xs text-gray-600">
                <Building className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate font-medium">{quotation['Nombre del Proveedor']}</span>
              </div>

              {/* Delivery Time */}
              <div className="mt-2 flex items-center text-xs text-gray-600">
                <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="font-medium">
                  Entrega: {quotation['Plazo de entrega'] || 'No especificado'}
                </span>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => handleViewDetails(quotation)}
                className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
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