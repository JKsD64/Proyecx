import { MaintenanceEvent, EventFilters, EventStatistics, EventSortOptions, MediaItem } from '../types/event';

export class EventService {
  private googleSheetsUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSPxGv63oDQ-OTM-K5R1rJote0aPAzfcP2OgjtBg1rIelemz_M6UcQpfNzeOyW7lFvcCPAmof7eKuYl/pub?output=csv';

  async loadData(): Promise<MaintenanceEvent[]> {
    try {
      console.log('Cargando datos de eventos desde Google Sheets...');
      const response = await fetch(this.googleSheetsUrl);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`No se pudo cargar el archivo CSV: ${response.status} ${response.statusText}`);
      }
      const csvText = await response.text();
      console.log(`Datos de eventos cargados exitosamente: ${csvText.length} caracteres, procesando CSV...`);
      return this.parseCSV(csvText);
    } catch (error) {
      console.error('Error al cargar datos de eventos desde Google Sheets:', error);
      console.log('Usando datos de muestra como respaldo...');
      return this.loadSampleData();
    }
  }

  private parseCSV(csvText: string): MaintenanceEvent[] {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: MaintenanceEvent[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = this.parseCSVLine(lines[i]);
        if (values.length >= headers.length) {
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].trim().replace(/"/g, '') : '';
          });
          data.push(row as MaintenanceEvent);
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

  private loadSampleData(): MaintenanceEvent[] {
    return [
      {
        "Fecha": "15-01-2025",
        "Hora": "09:30",
        "Tipo de evento": "Tarjeta de Mantenimiento",
        "Ubicación": "Planta Principal - Línea 1",
        "Descripción del problema": "Fuga de aceite en motor principal de la línea de producción",
        "Responsable": "Juan Pérez",
        "Estado": "Completado",
        "Prioridad": "Alta",
        "Tiempo estimado (horas)": "4",
        "Tiempo real (horas)": "3.5",
        "Descripción de la solución": "Reemplazo de sello principal y limpieza del área afectada",
        "Materiales utilizados": "Sello de motor, aceite hidráulico, trapos industriales",
        "Costo estimado": "150000",
        "Costo real": "135000",
        "Observaciones": "Trabajo completado sin incidentes. Se recomienda inspección mensual.",
        "Registro evento 1": "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg",
        "Registro evento 2": "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg",
        "Registro evento 3": "",
        "Registro solución 1": "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg",
        "Registro solución 2": "https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg",
        "Registro solución 3": ""
      },
      {
        "Fecha": "16-01-2025",
        "Hora": "14:15",
        "Tipo de evento": "Tarjeta de Seguridad",
        "Ubicación": "Almacén - Zona B",
        "Descripción del problema": "Estantería con daño estructural detectado durante inspección",
        "Responsable": "María González",
        "Estado": "En Progreso",
        "Prioridad": "Crítica",
        "Tiempo estimado (horas)": "8",
        "Tiempo real (horas)": "0",
        "Descripción de la solución": "Refuerzo estructural y reemplazo de elementos dañados",
        "Materiales utilizados": "",
        "Costo estimado": "300000",
        "Costo real": "0",
        "Observaciones": "Área acordonada por seguridad. Trabajo programado para mañana.",
        "Registro evento 1": "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg",
        "Registro evento 2": "",
        "Registro evento 3": "",
        "Registro solución 1": "",
        "Registro solución 2": "",
        "Registro solución 3": ""
      },
      {
        "Fecha": "17-01-2025",
        "Hora": "11:00",
        "Tipo de evento": "Orden de Trabajo",
        "Ubicación": "Oficinas - Piso 2",
        "Descripción del problema": "Sistema de aire acondicionado no funciona correctamente",
        "Responsable": "Carlos Rodríguez",
        "Estado": "Pendiente",
        "Prioridad": "Media",
        "Tiempo estimado (horas)": "6",
        "Tiempo real (horas)": "0",
        "Descripción de la solución": "Revisión y limpieza del sistema, reemplazo de filtros",
        "Materiales utilizados": "",
        "Costo estimado": "80000",
        "Costo real": "0",
        "Observaciones": "Programado para el próximo lunes",
        "Registro evento 1": "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg",
        "Registro evento 2": "https://images.pexels.com/photos/209251/pexels-photo-209251.jpeg",
        "Registro evento 3": "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
        "Registro solución 1": "",
        "Registro solución 2": "",
        "Registro solución 3": ""
      }
    ];
  }

  // Convertir URL de Google Drive al formato de visualización directa
  convertGoogleDriveUrl(url: string): string {
    if (!url || !url.includes('drive.google.com')) return url;
    
    // Extraer el ID del archivo de diferentes formatos de URL de Google Drive
    let fileId = null;
    
    // Formato: /file/d/ID/view
    const fileIdMatch1 = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch1) {
      fileId = fileIdMatch1[1];
    }
    
    // Formato: /d/ID/view (formato alternativo)
    const fileIdMatch2 = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!fileId && fileIdMatch2) {
      fileId = fileIdMatch2[1];
    }
    
    // Formato: id=ID (en parámetros de URL)
    const fileIdMatch3 = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (!fileId && fileIdMatch3) {
      fileId = fileIdMatch3[1];
    }
    
    if (fileIdMatch) {
      // Usar el endpoint de visualización directa de Google Drive
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    
    return url;
  }

  // Determinar si es imagen o video basado en la URL
  getMediaType(url: string): 'image' | 'video' {
    // Por defecto asumimos imagen, pero se podría mejorar con metadata
    return 'image';
  }

  // Procesar registros multimedia de un evento
  processEventMedia(event: MaintenanceEvent): { eventMedia: MediaItem[], solutionMedia: MediaItem[] } {
    const eventMedia: MediaItem[] = [];
    const solutionMedia: MediaItem[] = [];

    // Procesar registros de eventos
    for (let i = 1; i <= 3; i++) {
      const url = event[`Registro evento ${i}` as keyof MaintenanceEvent];
      if (url && url.trim()) {
        eventMedia.push({
          url: this.convertGoogleDriveUrl(url),
          type: this.getMediaType(url),
          title: `Registro del Problema ${i}`
        });
      }
    }

    // Procesar registros de soluciones
    for (let i = 1; i <= 3; i++) {
      const url = event[`Registro solución ${i}` as keyof MaintenanceEvent];
      if (url && url.trim()) {
        solutionMedia.push({
          url: this.convertGoogleDriveUrl(url),
          type: this.getMediaType(url),
          title: `Registro de la Solución ${i}`
        });
      }
    }

    return { eventMedia, solutionMedia };
  }

  getUniqueValues(data: MaintenanceEvent[], field: keyof MaintenanceEvent): string[] {
    return [...new Set(data.map(row => row[field]).filter(value => value && value !== 'No especificado'))].sort();
  }

  getStatistics(data: MaintenanceEvent[]): EventStatistics {
    const totalEvents = data.length;
    const completedEvents = data.filter(e => e.Estado === 'Completado').length;
    const pendingEvents = data.filter(e => e.Estado === 'Pendiente').length;
    const inProgressEvents = data.filter(e => e.Estado === 'En Progreso').length;

    const completedWithTime = data.filter(e => e.Estado === 'Completado' && parseFloat(e['Tiempo real (horas)']) > 0);
    const avgCompletionTime = completedWithTime.length > 0 
      ? completedWithTime.reduce((sum, e) => sum + parseFloat(e['Tiempo real (horas)']), 0) / completedWithTime.length 
      : 0;

    const totalCost = data.reduce((sum, e) => {
      const cost = parseFloat(e['Costo real']) || parseFloat(e['Costo estimado']) || 0;
      return sum + cost;
    }, 0);

    return {
      totalEvents,
      completedEvents,
      pendingEvents,
      inProgressEvents,
      avgCompletionTime,
      totalCost
    };
  }

  filterData(data: MaintenanceEvent[], filters: EventFilters): MaintenanceEvent[] {
    return data.filter(event => {
      if (filters.search) {
        const searchableText = Object.values(event).join(' ').toLowerCase();
        if (!searchableText.includes(filters.search.toLowerCase())) return false;
      }

      if (filters.tipo && event['Tipo de evento'] !== filters.tipo) return false;
      if (filters.ubicacion && event['Ubicación'] !== filters.ubicacion) return false;
      if (filters.responsable && event['Responsable'] !== filters.responsable) return false;
      if (filters.estado && event['Estado'] !== filters.estado) return false;
      if (filters.prioridad && event['Prioridad'] !== filters.prioridad) return false;

      if (filters.fechaDesde || filters.fechaHasta) {
        const eventDate = this.parseDate(event.Fecha);
        if (filters.fechaDesde && eventDate < new Date(filters.fechaDesde)) return false;
        if (filters.fechaHasta && eventDate > new Date(filters.fechaHasta)) return false;
      }

      return true;
    });
  }

  sortData(data: MaintenanceEvent[], sortOptions: EventSortOptions): MaintenanceEvent[] {
    return [...data].sort((a, b) => {
      let comparison = 0;
      
      switch (sortOptions.field) {
        case 'fecha':
          comparison = this.parseDate(a.Fecha).getTime() - this.parseDate(b.Fecha).getTime();
          break;
        case 'prioridad':
          const priorityOrder = { 'Crítica': 4, 'Alta': 3, 'Media': 2, 'Baja': 1 };
          comparison = (priorityOrder[a.Prioridad as keyof typeof priorityOrder] || 0) - 
                     (priorityOrder[b.Prioridad as keyof typeof priorityOrder] || 0);
          break;
        case 'estado':
          comparison = a.Estado.localeCompare(b.Estado);
          break;
        case 'tipo':
          comparison = a['Tipo de evento'].localeCompare(b['Tipo de evento']);
          break;
      }
      
      return sortOptions.order === 'desc' ? -comparison : comparison;
    });
  }

  private parseDate(dateStr: string): Date {
    if (!dateStr) return new Date();
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    return new Date(dateStr);
  }

  formatCurrency(amount: string | number): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return 'N/A';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(num);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'N/A';
    return dateStr;
  }

  formatTime(timeStr: string): string {
    if (!timeStr) return 'N/A';
    return timeStr;
  }
}