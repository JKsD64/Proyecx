import React from 'react';
import { Package, Building, Tag, Clock, Hash, FileText, Ruler } from 'lucide-react';
import { Quotation } from '../types/quotation';
import { QuotationDetailModal } from './QuotationDetailModal';

interface QuotationCardsProps {
  darkMode: boolean;
  data: Quotation[];
}

export const QuotationCards: React.FC<QuotationCardsProps> = ({ darkMode, data }) => {
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
      <div className={`${
        darkMode 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      } backdrop-blur-sm rounded-2xl shadow-xl border p-8 text-center`}>
        <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Package className="w-8 h-8 text-white" />
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
    <div className="space-y-6">
      {/* Header */}
      <div className={`${
        darkMode 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      } backdrop-blur-sm rounded-2xl shadow-xl border px-6 py-4 flex justify-between items-center`}>
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Cotizaciones ({data.length} resultados)
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((quotation, index) => (
          <div key={index} className={`${
            darkMode 
              ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
              : 'bg-white/80 border-gray-200 hover:bg-white'
          } backdrop-blur-sm rounded-2xl shadow-xl border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden transform hover:scale-105`}>
            {/* Card Header with PDF badge */}
            <div className="relative p-4 pb-2">
              <div className="absolute top-3 right-3 z-10">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  quotation['Tipo de item'] === 'Producto' || !quotation['Tipo de item'] || quotation['Tipo de item'] === 'Componente'
                    ? darkMode 
                      ? 'bg-blue-900/50 text-blue-300 border border-blue-700' 
                      : 'bg-blue-100 text-blue-800'
                    : darkMode 
                      ? 'bg-green-900/50 text-green-300 border border-green-700' 
                      : 'bg-green-100 text-green-800'
                }`}>
                  <Package className="w-3 h-3 mr-1" />
                  {quotation['Tipo de item'] === 'Producto' || !quotation['Tipo de item'] || quotation['Tipo de item'] === 'Componente' ? 'COMPONENTE' : 'SERVICIO'}
                </span>
              </div>
              
              {/* Product Image */}
              <div className={`w-full h-32 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              } rounded-xl overflow-hidden mb-3 relative`}>
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
             <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} text-sm mb-2 line-clamp-2 min-h-[2.5rem]`}>
                {quotation['Descripción del Producto - Resumida']}
              </h3>

              {/* Price */}
             <div className={`text-2xl font-bold mb-3 ${
               darkMode ? 'text-blue-400' : 'text-blue-600'
             }`}>
                {formatPrice(quotation['Precio Unitario Neto en CLP'])}
                {quotation['Cantidad'] && quotation['Cantidad'] !== '1' && (
                 <span className={`text-sm ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                   x{quotation['Cantidad']}
                 </span>
                )}
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                 <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tipo:</span>
                 <span className={`font-medium text-right ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {quotation['Tipo de Componente'] || 'No especificado'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                 <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Marca:</span>
                 <span className={`font-medium text-right ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {quotation['Marca del Componente'] || 'No especificado'}
                  </span>
                </div>
                
                {quotation['Modelo del Componente'] && quotation['Modelo del Componente'] !== 'No aplica' && (
                  <div className="flex justify-between">
                   <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Modelo:</span>
                   <span className={`font-medium text-right truncate ml-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {quotation['Modelo del Componente']}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                 <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Diámetro:</span>
                 <span className={`font-medium text-right ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {quotation['Diámetro'] || 'No especificado'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                 <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Archivo:</span>
                 <span className={`font-medium text-right truncate ml-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {quotation['Nombre del archivo'] || 'No especificado'}
                  </span>
                </div>
              </div>

              {/* Provider Badge */}
             <div className={`mt-3 flex items-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <Building className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate font-medium">{quotation['Nombre del Proveedor']}</span>
              </div>

              {/* Delivery Time */}
             <div className={`mt-2 flex items-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="font-medium">
                  Entrega: {quotation['Plazo de entrega'] || 'No especificado'}
                </span>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => handleViewDetails(quotation)}
               className={`w-full mt-4 py-2 px-4 rounded-xl transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                 darkMode 
                   ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' 
                   : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
               }`}
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
        darkMode={darkMode}
      />
    </div>
  );
};