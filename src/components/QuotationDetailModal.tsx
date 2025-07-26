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
  onClose,
  darkMode = false
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
    <div className={`flex items-start py-0 border-b last:border-b-0 ${
      darkMode ? 'border-gray-700' : 'border-gray-100'
    }`}>
      <div className="flex items-center mr-1 mt-0">
        <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>{label}:</div>
        <div className={`text-xs break-words ${
          darkMode ? 'text-gray-200' : 'text-gray-900'
        }`}>{value || 'No especificado'}</div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal container */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Modal panel */}
          <div className={`relative w-full max-w-[95vw] h-[95vh] overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl flex flex-col ${
            darkMode ? 'bg-gray-900' : 'bg-white'
          }`}>
          {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center justify-between w-full">
                <h3 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Detalles de la Cotización
                </h3>
              </div>
              <button
                onClick={onClose}
                className={`transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Content */}
            <div className={`flex flex-1 overflow-hidden ${
              darkMode ? 'bg-gray-900' : 'bg-white'
            }`}>
            {/* Left Side - Image or PDF */}
              <div className={`flex-1 px-6 py-4 flex flex-col overflow-hidden relative ${
                darkMode ? 'bg-gray-900' : 'bg-white'
              }`}>
              {/* View Toggle Buttons - Positioned outside image at top right */}
                <div className={`absolute top-4 right-10 z-20 flex items-center rounded-lg shadow-md border p-1 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                <button
                    onClick={() => setLeftViewMode('image')}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      leftViewMode === 'image'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : darkMode 
                          ? 'text-gray-300 hover:text-white' 
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
                        : darkMode 
                          ? 'text-gray-300 hover:text-white' 
                          : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FileIcon className="w-4 h-4 mr-2" />
                    Cotización
                  </button>
                </div>

                {leftViewMode === 'image' ? (
                /* Product Image View */
                  <div className={`w-full h-full rounded-lg overflow-hidden flex items-center justify-center ${
                    darkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    {!imageError && getImageUrl(quotation) ? (
                      <img
                        src={getImageUrl(quotation)!}
                        alt={quotation['Descripción del Producto - Resumida']}
                        className="max-w-full max-h-full object-contain"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className={`text-center ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
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
                      <div className={`flex items-center justify-between mb-3 p-2 rounded-lg ${
                        darkMode ? 'bg-gray-800' : 'bg-gray-100'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleZoomOut}
                            disabled={zoomLevel <= 50}
                            className={`p-1 transition-colors disabled:cursor-not-allowed ${
                              darkMode 
                                ? 'text-gray-300 hover:text-white disabled:text-gray-600' 
                                : 'text-gray-600 hover:text-gray-800 disabled:text-gray-400'
                            }`}
                            title="Reducir zoom"
                          >
                            <ZoomOut className="w-4 h-4" />
                          </button>
                        
                          <span className={`text-sm font-medium min-w-[60px] text-center ${
                            darkMode ? 'text-gray-200' : 'text-gray-700'
                          }`}>
                            {zoomLevel}%
                          </span>
                        
                          <button
                            onClick={handleZoomIn}
                            disabled={zoomLevel >= 200}
                            className={`p-1 transition-colors disabled:cursor-not-allowed ${
                              darkMode 
                                ? 'text-gray-300 hover:text-white disabled:text-gray-600' 
                                : 'text-gray-600 hover:text-gray-800 disabled:text-gray-400'
                            }`}
                            title="Aumentar zoom"
                          >
                            <ZoomIn className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleRotate}
                            className={`p-1 transition-colors ${
                              darkMode 
                                ? 'text-gray-300 hover:text-white' 
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                            title="Rotar 90°"
                          >
                            <RotateCw className="w-4 h-4" />
                          </button>
                        
                          <button
                            onClick={handleFitToWidth}
                            className={`p-1 transition-colors ${
                              darkMode 
                                ? 'text-gray-300 hover:text-white' 
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
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
                    <div className={`w-full flex-1 rounded-lg overflow-auto ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
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
                        <div className={`w-full h-full flex items-center justify-center ${
                          darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
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
              <div className={`flex-1 border-l flex flex-col overflow-hidden ${
                darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
              }`}>
                <div className={`px-3 py-2 flex-1 flex flex-col min-h-0 ${
                  darkMode ? 'bg-gray-900' : 'bg-white'
                }`}>
                <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-xs font-semibold flex items-center ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <Package className="w-3 h-3 mr-1" />
                      Resumen de Cotización
                    </h4>
                  </div>

                  {/* Information Summary */}
                  <div 
                    ref={detailsRef}
                    className="flex-1 overflow-y-auto space-y-1 pr-1 min-h-0"
                    style={{
                      scrollbarWidth: 'auto',
                      scrollbarColor: '#9ca3af #f3f4f6'
                    }}
                    onWheel={(e) => e.stopPropagation()}
                  >
                  {/* Product Title */}
                    <div className={`p-1 rounded border-l border-blue-500 ${
                      darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
                    }`}>
                      <h5 className={`text-xs font-medium mb-0.5 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {quotation['Descripción del Producto - Resumida']}
                      </h5>
                      <div className={`flex items-center space-x-1 text-xs ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        <span className={`inline-flex items-center px-1 py-0.5 rounded text-xs font-medium ${
                          quotation['Tipo de item'] === 'Servicio'
                            ? darkMode 
                              ? 'bg-green-900/50 text-green-300' 
                              : 'bg-green-100 text-green-800'
                            : darkMode 
                              ? 'bg-blue-900/50 text-blue-300' 
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          <Package className="w-2 h-2 mr-0.5" />
                          {quotation['Tipo de item'] === 'Servicio' ? 'SERVICIO' : 'COMPONENTE'}
                        </span>
                        <span className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Fecha: {formatDate(quotation['Fecha y hora'])}
                        </span>
                      </div>
                    </div>

                    {/* Price Section */}
                    <div className={`p-1 rounded border-l border-green-500 ${
                      darkMode ? 'bg-green-900/30' : 'bg-green-50'
                    }`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className={`text-xs ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>Precio Unitario</div>
                          <div className={`text-xs font-bold ${
                            darkMode ? 'text-green-400' : 'text-green-600'
                          }`}>
                            {formatPrice(quotation['Precio Unitario Neto en CLP'])}
                          </div>
                        </div>
                        {quotation['Cantidad'] && quotation['Cantidad'] !== '1' && (
                          <div className="text-right">
                            <div className={`text-xs ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>Cant: {quotation['Cantidad']}</div>
                            <div className={`text-xs font-semibold ${
                              darkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}>
                              Total: {formatPrice(quotation['Precio Total Neto en CLP'])}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  
                    {/* Details Grid */}
                    <div className="space-y-1">
                      {/* Provider Section */}
                      <div className={`p-1 rounded border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      }`}>
                        <h6 className={`text-xs font-medium mb-1 flex items-center ${
                          darkMode ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          <Building className="w-2 h-2 mr-0.5" />
                          Información del Proveedor
                        </h6>
                        <div className="space-y-0">
                          <DetailRow
                            icon={<Building className="w-2 h-2" />}
                            label="Proveedor"
                            value={quotation['Nombre del Proveedor']}
                          />
                          <DetailRow
                            icon={<Clock className="w-2 h-2" />}
                            label="Plazo de Entrega"
                            value={quotation['Plazo de entrega']}
                          />
                        </div>
                      </div>

                      {/* Product Details Section */}
                      <div className={`p-1 rounded border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      }`}>
                        <h6 className={`text-xs font-medium mb-1 flex items-center ${
                          darkMode ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          <Package className="w-2 h-2 mr-0.5" />
                          Especificaciones del Producto
                        </h6>
                        <div className="space-y-0">
                          <DetailRow
                            icon={<Tag className="w-2 h-2" />}
                            label="Marca"
                            value={quotation['Marca del Componente']}
                          />
                          <DetailRow
                            icon={<Package className="w-2 h-2" />}
                            label="Modelo"
                            value={quotation['Modelo del Componente']}
                          />
                          <DetailRow
                            icon={<Wrench className="w-2 h-2" />}
                            label="Tipo de Componente"
                            value={quotation['Tipo de Componente']}
                          />
                          <DetailRow
                            icon={<Package className="w-2 h-2" />}
                            label="Material"
                            value={quotation['Material']}
                          />
                          <DetailRow
                            icon={<Ruler className="w-2 h-2" />}
                            label="Diámetro"
                            value={quotation['Diámetro']}
                          />
                        </div>
                      </div>

                      {/* Files Section */}
                      <div className={`p-1 rounded border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      }`}>
                        <h6 className={`text-xs font-medium mb-1 flex items-center ${
                          darkMode ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          <FileText className="w-2 h-2 mr-0.5" />
                          Archivos y Documentos
                        </h6>
                        <div className="space-y-0">
                          <DetailRow
                            icon={<FileText className="w-2 h-2" />}
                            label="Nombre del Archivo"
                            value={quotation['Nombre del archivo']}
                          />
                          {quotation['Link archivo PDF'] && (
                            <div className="flex items-center justify-between py-0">
                              <span className={`text-xs font-medium ${
                                darkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>PDF de Cotización:</span>
                              <button
                                onClick={handlePDFView}
                                className="flex items-center px-1 py-0.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                              >
                                <ExternalLink className="w-2 h-2 mr-0.5" />
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
            <div className={`px-3 py-2 border-t flex-shrink-0 ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    darkMode 
                      ? 'text-gray-200 bg-gray-700 hover:bg-gray-600' 
                      : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};