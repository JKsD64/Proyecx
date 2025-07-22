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
  "Link archivo PDF"?: string;
}

export interface QuotationFilters {
  search?: string;
  proveedor?: string;
  marca?: string;
  tipo?: string;
  material?: string;
  year?: string;
  priceRange?: string;
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