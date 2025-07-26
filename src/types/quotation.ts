export interface Quotation {
  "Fecha y hora": string;
  "Descripción del Producto - Resumida": string;
  "Nombre del Proveedor": string;
  "Marca del Componente": string;
  "Modelo del Componente": string;
  "Tipo de Componente": string;
  "Material": string;
  "Diámetro": string;
  "Precio Unitario Neto en CLP": string;
  "Cantidad": string;
  "Precio Total Neto en CLP": string;
  "Plazo de entrega": string;
  "Nombre del archivo"?: string;
  "Link archivo PDF"?: string;
  "Link Imagen"?: string;
  "Tipo de item"?: string;
}

export interface QuotationFilters {
  search?: string;
  proveedor?: string;
  marca?: string;
  tipo?: string;
  modelo?: string;
  diametro?: string;
  tipoCotizacion?: string;
  year?: string;
}

export interface SortOptions {
  field: 'price' | 'alphabetical';
  order: 'asc' | 'desc';
}

export interface QuotationStatistics {
  totalItems: number;
  totalProviders: number;
  avgPrice: number;
  totalValue: number;
  maxPrice: number;
  minPrice: number;
}

export interface TopProvider {
  name: string;
  count: number;
}

export interface PriceRanges {
  [key: string]: number;
}

export interface QuotationDetailModalProps {
  quotation: Quotation | null;
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
}