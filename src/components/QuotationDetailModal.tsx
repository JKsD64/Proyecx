import React from 'react';
import { X, Calendar, Building, Tag, Package, Wrench, Ruler, Clock, FileText, ExternalLink, ZoomIn, ZoomOut, RotateCw, Maximize2, Image, FileText as FileIcon } from 'lucide-react';
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
  const [pdfError, setPdfError] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState(100);
  const [rotation, setRotation] = React.useState(0);
  const [leftViewMode, setLeftViewMode] = React.useState<'image' | 'pdf'>('image');

  const detailsRef = React.useRef<HTMLDivElement>(null);

  // Reset errors when quotation changes
  React.useEffect(() => {
    setPdfError(false);
    setImageError(false);
    setZoomLevel(100);
    setRotation(0);
    setLeftViewMode('image');
  }, [quotation]);

  // Redirect all scroll events to modal details when modal is open
  React.useEffect(() => {
    if (isOpen) {
      const handleGlobalWheel = (e: WheelEvent) => {
        e.preventDefault();
        
        if (detailsRef.current) {
          // Apply scroll to the details section
          detailsRef.current.scrollTop += e.deltaY;
        }
      };

      // Add global wheel event listener
      document.addEventListener('wheel', handleGlobalWheel, { passive: false });
      
      return () => {
        // Remove global wheel event listener
        document.removeEventListener('wheel', handleGlobalWheel);
      };
    }
  }, [isOpen]);

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

  const getPDFEmbedUrl = (pdfUrl: string) => {
    // Try multiple PDF embedding methods
    const encodedUrl = encodeURIComponent(pdfUrl);
    
    // Method 1: Direct PDF with #view=FitH (works for direct PDF links)
    if (pdfUrl.toLowerCase().endsWith('.pdf')) {
      return `${pdfUrl}#view=FitH&toolbar=0&navpanes=0`;
    }
    
    // Method 2: Google Drive PDF viewer
    if (pdfUrl.includes('drive.google.com')) {
      const fileId = pdfUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    
    // Method 3: Mozilla PDF.js viewer
    return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodedUrl}`;
  };
  const handlePDFView = () => {
    const pdfLink = quotation['Link archivo PDF'];
    if (pdfLink) {
      window.open(pdfLink, '_blank');
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleFitToWidth = () => {
    setZoomLevel(100);
    setRotation(0);
  };
  const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
    icon, label, value
  }) => (
    <div className="flex items-start py-0.5 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center mr-2 mt-0.5">
        <div className="text-gray-500">
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-600 mb-0.5">{label}:</div>
        <div className="text-xs text-gray-900 break-words">{value || 'No especificado'}</div>
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
        <div className="inline-block w-full max-w-[95vw] h-[95vh] my-4 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalles de la Cotización
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Side - Image or PDF */}
            <div className="flex-1 px-6 py-4 flex flex-col overflow-hidden relative">
              {/* View Toggle Buttons - Positioned outside image at top right */}
              <div className="absolute top-4 right-10 z-20 flex items-center bg-white rounded-lg shadow-md border border-gray-200 p-1">
                <button
                  onClick={() => setLeftViewMode('image')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    leftViewMode === 'image'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Image className="w-4 h-4 mr-2" />
                  Imagen
                </button>
                <button
                  onClick={() => setLeftViewMode('pdf')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    leftViewMode === 'pdf'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileIcon className="w-4 h-4 mr-2" />
                  Cotización
                </button>
              </div>

              {leftViewMode === 'image' ? (
                /* Product Image View */
                <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  {!imageError && getImageUrl(quotation) ? (
                    <img
                      src={getImageUrl(quotation)!}
                      alt={quotation['Descripción del Producto - Resumida']}
                      className="max-w-full max-h-full object-contain"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <Package className="w-24 h-24 mx-auto mb-4" />
                      <span className="text-lg">Imagen no disponible</span>
                    </div>
                  )}
                </div>
              ) : (
                /* PDF View */
                <div className="w-full h-full flex flex-col">
                  {/* PDF Controls */}
                  {quotation['Link archivo PDF'] && !pdfError && (
                    <div className="flex items-center justify-between mb-3 p-2 bg-gray-100 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleZoomOut}
                          disabled={zoomLevel <= 50}
                          className="p-1 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                          title="Reducir zoom"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </button>
                        
                        <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                          {zoomLevel}%
                        </span>
                        
                        <button
                          onClick={handleZoomIn}
                          disabled={zoomLevel >= 200}
                          className="p-1 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                          title="Aumentar zoom"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleRotate}
                          className="p-1 text-gray-600 hover:text-gray-800"
                          title="Rotar 90°"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={handleFitToWidth}
                          className="p-1 text-gray-600 hover:text-gray-800"
                          title="Ajustar al ancho"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={handlePDFView}
                          className="flex items-center px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Abrir
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PDF Embed */}
                  <div className="w-full flex-1 bg-gray-100 rounded-lg overflow-auto">
                    {quotation['Link archivo PDF'] && !pdfError ? (
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                          transformOrigin: 'center center',
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        <iframe
                          src={getPDFEmbedUrl(quotation['Link archivo PDF'])}
                          className="w-full h-full border-0"
                          title="Previsualización PDF"
                          onLoad={(e) => {
                            const iframe = e.target as HTMLIFrameElement;
                            try {
                              if (iframe.contentWindow) {
                                iframe.contentWindow.addEventListener('error', () => setPdfError(true));
                              }
                            } catch (error) {
                              console.log('PDF preview loaded');
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <FileText className="w-24 h-24 mx-auto mb-4" />
                          <span className="text-lg mb-4 block">
                            {quotation['Link archivo PDF'] ? 'Error al cargar vista previa' : 'PDF no disponible'}
                          </span>
                          {quotation['Link archivo PDF'] && (
                            <button
                              onClick={handlePDFView}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                              <ExternalLink className="w-4 h-4 inline mr-2" />
                              Abrir PDF
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Information Summary */}
            <div className="flex-1 border-l border-gray-200 flex flex-col">
              <div className="px-6 py-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                    <Package className="w-6 h-6 mr-2" />
                    Resumen de Cotización
                  </h4>
                </div>

                {/* Information Summary */}
                <div 
                  ref={detailsRef}
                  className="flex-1 overflow-y-auto space-y-2 pr-2"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e1 #f1f5f9'
                  }}
                  onWheel={(e) => e.stopPropagation()}
                >
                  {/* Product Title */}
                  <div className="p-2 bg-blue-50 rounded-md border-l-2 border-blue-500">
                    <h5 className="text-xs font-semibold text-gray-900 mb-1">
                      {quotation['Descripción del Producto - Resumida']}
                    </h5>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        quotation['Tipo de item'] === 'Servicio'
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        <Package className="w-2 h-2 mr-1" />
                        {quotation['Tipo de item'] === 'Servicio' ? 'SERVICIO' : 'COMPONENTE'}
                      </span>
                      <span className="text-gray-500">
                        Fecha: {formatDate(quotation['Fecha y hora'])}
                      </span>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="p-2 bg-green-50 rounded-md border-l-2 border-green-500">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-gray-600 mb-0.5">Precio Unitario</div>
                        <div className="text-sm font-bold text-green-600">
                          {formatPrice(quotation['Precio Unitario Neto en CLP'])}
                        </div>
                      </div>
                      {quotation['Cantidad'] && quotation['Cantidad'] !== '1' && (
                        <div className="text-right">
                          <div className="text-xs text-gray-600">Cantidad: {quotation['Cantidad']}</div>
                          <div className="text-xs font-semibold text-gray-800">
                            Total: {formatPrice(quotation['Precio Total Neto en CLP'])}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Details Grid */}
                  <div className="space-y-2">
                    {/* Provider Section */}
                    <div className="bg-white p-2 rounded-md border border-gray-200">
                      <h6 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                        <Building className="w-3 h-3 mr-1" />
                        Información del Proveedor
                      </h6>
                      <div className="space-y-0.5">
                        <DetailRow
                          icon={<Building className="w-3 h-3" />}
                          label="Proveedor"
                          value={quotation['Nombre del Proveedor']}
                        />
                        <DetailRow
                          icon={<Clock className="w-3 h-3" />}
                          label="Plazo de Entrega"
                          value={quotation['Plazo de entrega']}
                        />
                      </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="bg-white p-2 rounded-md border border-gray-200">
                      <h6 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                        <Package className="w-3 h-3 mr-1" />
                        Especificaciones del Producto
                      </h6>
                      <div className="space-y-0.5">
                        <DetailRow
                          icon={<Tag className="w-3 h-3" />}
                          label="Marca"
                          value={quotation['Marca del Componente']}
                        />
                        <DetailRow
                          icon={<Package className="w-3 h-3" />}
                          label="Modelo"
                          value={quotation['Modelo del Componente']}
                        />
                        <DetailRow
                          icon={<Wrench className="w-3 h-3" />}
                          label="Tipo de Componente"
                          value={quotation['Tipo de Componente']}
                        />
                        <DetailRow
                          icon={<Package className="w-3 h-3" />}
                          label="Material"
                          value={quotation['Material']}
                        />
                        <DetailRow
                          icon={<Ruler className="w-3 h-3" />}
                          label="Diámetro"
                          value={quotation['Diámetro']}
                        />
                      </div>
                    </div>

                    {/* Files Section */}
                    <div className="bg-white p-2 rounded-md border border-gray-200">
                      <h6 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                        <FileText className="w-3 h-3 mr-1" />
                        Archivos y Documentos
                      </h6>
                      <div className="space-y-0.5">
                        <DetailRow
                          icon={<FileText className="w-3 h-3" />}
                          label="Nombre del Archivo"
                          value={quotation['Nombre del archivo']}
                        />
                        {quotation['Link archivo PDF'] && (
                          <div className="flex items-center justify-between py-0.5">
                            <span className="text-xs font-medium text-gray-600">PDF de Cotización:</span>
                            <button
                              onClick={handlePDFView}
                              className="flex items-center px-1.5 py-0.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                            >
                              <ExternalLink className="w-2 h-2 mr-1" />
                              Abrir PDF
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
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