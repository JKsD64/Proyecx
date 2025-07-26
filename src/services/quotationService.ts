import { Quotation, QuotationFilters, QuotationStatistics, TopProvider, PriceRanges, SortOptions } from '../types/quotation';

export class QuotationService {
  private googleSheetsUrl = import.meta.env.PROD 
    ? '/.netlify/functions/google-sheets'
    : 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnf4Sm6V9ZWNHbHKDtC10sXRmxtdvO66SMFeIGIGE7SYeUgqbqeod010MNeGV0p3KIVcPOVmhBwpFI/pub?output=csv';

  async loadData(): Promise<Quotation[]> {
    try {
      console.log('Cargando datos desde Google Sheets...');
      const response = await fetch(this.googleSheetsUrl);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`No se pudo cargar el archivo CSV: ${response.status} ${response.statusText}`);
      }
      const csvText = await response.text();
      console.log(`Datos cargados exitosamente: ${csvText.length} caracteres, procesando CSV...`);
      return this.parseCSV(csvText);
    } catch (error) {
      console.error('Error al cargar datos desde Google Sheets:', error);
      console.log('Usando datos de muestra como respaldo...');
      return this.loadSampleData();
    }
  }

  private parseCSV(csvText: string): Quotation[] {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: Quotation[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = this.parseCSVLine(lines[i]);
        if (values.length >= headers.length) {
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].trim().replace(/"/g, '') : '';
          });
          data.push(row as Quotation);
        }
      }
    }

    return data;
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  private loadSampleData(): Quotation[] {
    return [
      {
        "Fecha y hora": "23-06-2025 23:09",
        "Descripción del Producto - Resumida": "Servicio de traslado, alojamiento y colación",
        "Nombre del Proveedor": "END INDUSTRIAL",
        "Marca del Componente": "No aplica",
        "Modelo del Componente": "No aplica",
        "Tipo de Componente": "No aplica",
        "Material": "No aplica",
        "Diámetro": "No aplica",
        "Precio Unitario Neto en CLP": "0",
        "Cantidad": "1",
        "Precio Total Neto en CLP": "0",
        "Plazo de entrega": "30 días",
        "Link Imagen": "",
        "Tipo de item": "Servicio",
        "Nombre del archivo": "servicio_traslado_001.pdf"
      },
      {
        "Fecha y hora": "23-06-2025 23:20",
        "Descripción del Producto - Resumida": "Fabricación e instalación de sistema de refrigeración industrial",
        "Nombre del Proveedor": "JDC REFRIGERACION INDUSTRIAL",
        "Marca del Componente": "No aplica",
        "Modelo del Componente": "No aplica",
        "Tipo de Componente": "Sistema de refrigeración",
        "Material": "No aplica",
        "Diámetro": "No aplica",
        "Precio Unitario Neto en CLP": "0",
        "Cantidad": "1",
        "Precio Total Neto en CLP": "0",
        "Plazo de entrega": "20 días",
        "Link Imagen": "",
        "Tipo de item": "Producto",
        "Nombre del archivo": "sistema_refrigeracion_industrial.pdf"
      },
      {
        "Fecha y hora": "28-06-2025 11:36",
        "Descripción del Producto - Resumida": "SERV COPIADO Y PALETA SERIE 83 LL NOR",
        "Nombre del Proveedor": "Abus Chile SPA",
        "Marca del Componente": "ABUS",
        "Modelo del Componente": "SERIE 83 LL NOR",
        "Tipo de Componente": "Servicio",
        "Material": "No especificado",
        "Diámetro": "No aplica",
        "Precio Unitario Neto en CLP": "1",
        "Cantidad": "2",
        "Precio Total Neto en CLP": "2",
        "Plazo de entrega": "No especificado",
        "Link Imagen": "",
        "Tipo de item": "Servicio",
        "Nombre del archivo": "abus_serie83_manual.pdf"
      },
      {
        "Fecha y hora": "28-06-2025 12:24",
        "Descripción del Producto - Resumida": "Abrazadera caddy de 1/2 pulgada",
        "Nombre del Proveedor": "Mantenciones AYF SPA",
        "Marca del Componente": "No especificado",
        "Modelo del Componente": "No especificado",
        "Tipo de Componente": "Abrazadera",
        "Material": "No especificado",
        "Diámetro": "1/2",
        "Precio Unitario Neto en CLP": "288",
        "Cantidad": "15",
        "Precio Total Neto en CLP": "4320",
        "Plazo de entrega": "No especificado",
        "Link Imagen": "",
        "Tipo de item": "Producto",
        "Nombre del archivo": "abrazadera_caddy_especificaciones.pdf"
      },
      {
        "Fecha y hora": "28-06-2025 12:01",
        "Descripción del Producto - Resumida": "Alojamiento modular BAMA para sensor PG 13,5 y G1",
        "Nombre del Proveedor": "Prominent Chile SPA",
        "Marca del Componente": "ProMinent",
        "Modelo del Componente": "BAMAEU1211XXF01X000000ES",
        "Tipo de Componente": "Alojamiento Modular",
        "Material": "SST (Acero Inoxidable)",
        "Diámetro": "PG 13,5 y G1",
        "Precio Unitario Neto en CLP": "595546",
        "Cantidad": "1",
        "Precio Total Neto en CLP": "595546",
        "Plazo de entrega": "Importación 6 a 8 semanas",
        "Link Imagen": "",
        "Tipo de item": "Producto",
        "Nombre del archivo": "prominent_bama_datasheet.pdf"
      }
    ];
  }

  getUniqueValues(data: Quotation[], field: keyof Quotation): string[] {
    return [...new Set(data.map(row => row[field]).filter(value => value && value !== 'No especificado'))].sort();
  }

  getStatistics(data: Quotation[]): QuotationStatistics {
    const totalItems = data.length;
    const totalProviders = new Set(data.map(row => row['Nombre del Proveedor']).filter(p => p)).size;
    
    const prices = data.map(row => parseFloat(row['Precio Unitario Neto en CLP']) || 0).filter(p => p > 0);
    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    
    const totalValues = data.map(row => parseFloat(row['Precio Total Neto en CLP']) || 0);
    const totalValue = totalValues.reduce((a, b) => a + b, 0);

    return {
      totalItems,
      totalProviders,
      avgPrice,
      totalValue,
      maxPrice: Math.max(...prices),
      minPrice: Math.min(...prices.filter(p => p > 0))
    };
  }

  filterData(data: Quotation[], filters: QuotationFilters): Quotation[] {
    return data.filter(row => {
      if (filters.search) {
        const searchableText = Object.values(row).join(' ').toLowerCase();
        if (!searchableText.includes(filters.search.toLowerCase())) return false;
      }

      if (filters.proveedor && row['Nombre del Proveedor'] !== filters.proveedor) return false;
      if (filters.marca && row['Marca del Componente'] !== filters.marca) return false;
      if (filters.tipo && row['Tipo de Componente'] !== filters.tipo) return false;
      if (filters.modelo && row['Modelo del Componente'] !== filters.modelo) return false;
      if (filters.diametro && row['Diámetro'] !== filters.diametro) return false;
      if (filters.tipoCotizacion && row['Tipo de item'] !== filters.tipoCotizacion) return false;
      
      if (filters.year) {
        const dateStr = row['Fecha y hora'];
        if (dateStr) {
          const parts = dateStr.split('-');
          const year = parts[2] ? parts[2].split(' ')[0] : '';
          if (year !== filters.year) return false;
        } else {
          return false;
        }
      }

      return true;
    });
  }

  sortData(data: Quotation[], sortOptions: SortOptions): Quotation[] {
    return [...data].sort((a, b) => {
      let comparison = 0;
      
      if (sortOptions.field === 'price') {
        const priceA = parseFloat(a['Precio Unitario Neto en CLP']) || 0;
        const priceB = parseFloat(b['Precio Unitario Neto en CLP']) || 0;
        comparison = priceA - priceB;
      } else if (sortOptions.field === 'alphabetical') {
        const nameA = a['Descripción del Producto - Resumida'].toLowerCase();
        const nameB = b['Descripción del Producto - Resumida'].toLowerCase();
        comparison = nameA.localeCompare(nameB);
      }
      
      return sortOptions.order === 'desc' ? -comparison : comparison;
    });
  }

  exportToCSV(data: Quotation[], filename = 'cotizaciones_filtradas.csv'): void {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header as keyof Quotation] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  getTopProviders(data: Quotation[], limit = 5): TopProvider[] {
    const providerCounts: { [key: string]: number } = {};
    data.forEach(row => {
      const provider = row['Nombre del Proveedor'];
      if (provider) {
        providerCounts[provider] = (providerCounts[provider] || 0) + 1;
      }
    });

    return Object.entries(providerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([name, count]) => ({ name, count }));
  }

  getTopBrands(data: Quotation[], limit = 5): TopProvider[] {
    const brandCounts: { [key: string]: number } = {};
    data.forEach(row => {
      const brand = row['Marca del Componente'];
      if (brand && brand !== 'No especificado') {
        brandCounts[brand] = (brandCounts[brand] || 0) + 1;
      }
    });

    return Object.entries(brandCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([name, count]) => ({ name, count }));
  }

  getPriceRanges(data: Quotation[]): PriceRanges {
    const ranges: PriceRanges = {
      '0-10000': 0,
      '10000-50000': 0,
      '50000-100000': 0,
      '100000-500000': 0,
      '500000+': 0
    };

    data.forEach(row => {
      const price = parseFloat(row['Precio Unitario Neto en CLP']) || 0;
      
      if (price <= 10000) ranges['0-10000']++;
      else if (price <= 50000) ranges['10000-50000']++;
      else if (price <= 100000) ranges['50000-100000']++;
      else if (price <= 500000) ranges['100000-500000']++;
      else ranges['500000+']++;
    });

    return ranges;
  }
}