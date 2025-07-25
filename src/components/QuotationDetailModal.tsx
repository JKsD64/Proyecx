import React from 'react';
import { X, Calendar, Building, Tag, Package, Wrench, Ruler, Clock, FileText, ExternalLink, Eye } from 'lucide-react';
import { Quotation } from '../types/quotation';

interface QuotationDetailModalProps {
  quotation: Quotation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuotationDetailModal: React.FC<QuotationDetailModalProps> = ({
  quotation,
  isOpen,
  onClose
}) => {
  if (!isOpen || !quotation) return null;

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
    if (parts.length >= 2) {
      const datePart = parts[0];
      const timePart = parts[1];
      return `${datePart} ${timePart}`;
    }
    return dateStr;
  };

  const getImageUrl = (quotation: Quotation) => {
    const imageLink = quotation['Link Imagen'];
    if (imageLink && imageLink.trim() && imageLink !== 'No aplica' && imageLink !== 'No especificado') {
      return imageLink.trim();
    }
    return null;
  };

  const handlePDFView = () => {
    const pdfLink = quotation['Link archivo PDF'];
    if (pdfLink) {
      window.open(pdfLink, '_blank');
    }
  };

  const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
    icon, label, value
  }) => (
    <div className="flex items-start py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center mr-4 mt-1">
        <div className="text-gray-500">
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-600 mb-1">{label}:</div>
        <div className="text-gray-900 break-words">{value || 'No especificado'}</div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Detalles de la Cotización
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex">
            {/* Left Side - Image and Details */}
            <div className="flex-1 px-6 py-4">
              {/* Product Image */}
              <div className="mb-6">
                <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                  {getImageUrl(quotation) ? (
                    <img
                      src={getImageUrl(quotation)!}
                      alt={quotation['Descripción del Producto - Resumida']}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center text-gray-400 ${getImageUrl(quotation) ? 'hidden' : ''}`}>
                    <div className="text-center">
                      <Package className="w-16 h-16 mx-auto mb-2" />
                      <span className="text-sm">Imagen no disponible</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="max-h-80 overflow-y-auto">
                <div className="space-y-0">
                  <DetailRow
                    icon={<Calendar className="w-4 h-4" />}
                    label="Fecha"
                    value={formatDate(quotation['Fecha y hora'])}
                  />
                  
                  <DetailRow
                    icon={<Building className="w-4 h-4" />}
                    label="Proveedor"
                    value={quotation['Nombre del Proveedor']}
                  />
                  
                  <DetailRow
                    icon={<Tag className="w-4 h-4" />}
                    label="Marca"
                    value={quotation['Marca del Componente']}
                  />
                  
                  <DetailRow
                    icon={<Package className="w-4 h-4" />}
                    label="Modelo"
                    value={quotation['Modelo del Componente']}
                  />
                  
                  <DetailRow
                    icon={<Wrench className="w-4 h-4" />}
                    label="Tipo Componente"
                    value={quotation['Tipo de Componente']}
                  />
                  
                  <DetailRow
                    icon={<Package className="w-4 h-4" />}
                    label="Material"
                    value={quotation['Material']}
                  />
                  
                  <DetailRow
                    icon={<Ruler className="w-4 h-4" />}
                    label="Diámetro"
                    value={quotation['Diámetro']}
                  />
                  
                  <DetailRow
                    icon={<Clock className="w-4 h-4" />}
                    label="Plazo Entrega"
                    value={quotation['Plazo de entrega']}
                  />
                  
                  <DetailRow
                    icon={<FileText className="w-4 h-4" />}
                    label="Descripción Original"
                    value={quotation['Descripción del Producto - Resumida']}
                  />
                </div>
              </div>
            </div>

            {/* Right Side - PDF Preview */}
            <div className="flex-1 border-l border-gray-200">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Previsualización PDF
                  </h4>
                  {quotation['Link archivo PDF'] && (
                    <button
                      onClick={handlePDFView}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir PDF
                    </button>
                  )}
                </div>

                {/* PDF Embed */}
                <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                  {quotation['Link archivo PDF'] ? (
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(quotation['Link archivo PDF'])}&embedded=true`}
                      className="w-full h-full border-0"
                      title="Previsualización PDF"
                      onError={() => {
                        console.log('Error loading PDF preview');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-2" />
                        <span className="text-sm">PDF no disponible</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">Precio Unitario</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(quotation['Precio Unitario Neto en CLP'])}
                </div>
                {quotation['Cantidad'] && quotation['Cantidad'] !== '1' && (
                  <div className="text-sm text-gray-500">
                    Cantidad: {quotation['Cantidad']} | Total: {formatPrice(quotation['Precio Total Neto en CLP'])}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};