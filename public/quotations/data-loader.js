// Script para cargar automáticamente los datos del CSV
class CotizacionesDataLoader {
    constructor() {
        this.csvPath = 'Info cotizaciones - Hoja 1.csv';
        this.allData = [];
        this.filteredData = [];
    }

    async loadData() {
        try {
            // Intentar cargar el archivo CSV local
            const response = await fetch(this.csvPath);
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo CSV');
            }
            const csvText = await response.text();
            return this.parseCSV(csvText);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            return this.loadSampleData();
        }
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = this.parseCSVLine(lines[i]);
                if (values.length >= headers.length) {
                    const row = {};
                    headers.forEach((header, index) => {
                        row[header] = values[index] ? values[index].trim().replace(/"/g, '') : '';
                    });
                    data.push(row);
                }
            }
        }

        return data;
    }

    parseCSVLine(line) {
        const result = [];
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

    loadSampleData() {
        // Datos de muestra basados en el archivo real
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
                "Plazo de entrega": "30 días"
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
                "Plazo de entrega": "20 días"
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
                "Plazo de entrega": "No especificado"
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
                "Plazo de entrega": "No especificado"
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
                "Plazo de entrega": "Importación 6 a 8 semanas"
            }
        ];
    }

    // Funciones de análisis de datos
    getUniqueValues(data, field) {
        return [...new Set(data.map(row => row[field]).filter(value => value && value !== 'No especificado'))].sort();
    }

    getStatistics(data) {
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

    filterData(data, filters) {
        return data.filter(row => {
            // Búsqueda general
            if (filters.search) {
                const searchableText = Object.values(row).join(' ').toLowerCase();
                if (!searchableText.includes(filters.search.toLowerCase())) return false;
            }

            // Filtros específicos
            if (filters.proveedor && row['Nombre del Proveedor'] !== filters.proveedor) return false;
            if (filters.marca && row['Marca del Componente'] !== filters.marca) return false;
            if (filters.tipo && row['Tipo de Componente'] !== filters.tipo) return false;
            if (filters.material && row['Material'] !== filters.material) return false;
            
            // Filtro de año
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

            // Filtro de precio
            if (filters.priceRange) {
                const price = parseFloat(row['Precio Unitario Neto en CLP']) || 0;
                const [min, max] = filters.priceRange.split('-').map(p => p.replace('+', ''));
                
                if (filters.priceRange.includes('+')) {
                    if (price < parseFloat(min)) return false;
                } else {
                    if (price < parseFloat(min) || price > parseFloat(max)) return false;
                }
            }

            return true;
        });
    }

    exportToCSV(data, filename = 'cotizaciones_filtradas.csv') {
        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
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

    // Funciones de validación de datos
    validateData(data) {
        const errors = [];
        const warnings = [];

        data.forEach((row, index) => {
            // Validar campos requeridos
            if (!row['Descripción del Producto - Resumida']) {
                errors.push(`Fila ${index + 2}: Descripción faltante`);
            }
            
            if (!row['Nombre del Proveedor']) {
                warnings.push(`Fila ${index + 2}: Proveedor no especificado`);
            }

            // Validar precios
            const price = parseFloat(row['Precio Unitario Neto en CLP']);
            if (isNaN(price) || price < 0) {
                warnings.push(`Fila ${index + 2}: Precio inválido`);
            }

            // Validar fechas
            const dateStr = row['Fecha y hora'];
            if (dateStr && !this.isValidDate(dateStr)) {
                warnings.push(`Fila ${index + 2}: Formato de fecha inválido`);
            }
        });

        return { errors, warnings };
    }

    isValidDate(dateStr) {
        const regex = /^\d{2}-\d{2}-\d{4}/;
        return regex.test(dateStr);
    }

    // Generar reportes
    generateReport(data) {
        const stats = this.getStatistics(data);
        const topProviders = this.getTopProviders(data, 5);
        const topBrands = this.getTopBrands(data, 5);
        const priceRanges = this.getPriceRanges(data);

        return {
            statistics: stats,
            topProviders,
            topBrands,
            priceRanges,
            generatedAt: new Date().toLocaleString('es-CL')
        };
    }

    getTopProviders(data, limit = 5) {
        const providerCounts = {};
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

    getTopBrands(data, limit = 5) {
        const brandCounts = {};
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

    getPriceRanges(data) {
        const ranges = {
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

// Exportar para uso en el HTML
window.CotizacionesDataLoader = CotizacionesDataLoader; 