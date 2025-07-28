export interface MaintenanceEvent {
  "Fecha": string;
  "Hora": string;
  "Tipo de evento": string;
  "Ubicación": string;
  "Descripción del problema": string;
  "Responsable": string;
  "Estado": string;
  "Prioridad": string;
  "Tiempo estimado (horas)": string;
  "Tiempo real (horas)": string;
  "Descripción de la solución": string;
  "Materiales utilizados": string;
  "Costo estimado": string;
  "Costo real": string;
  "Observaciones": string;
  "Registro evento 1": string;
  "Registro evento 2": string;
  "Registro evento 3": string;
  "Registro solución 1": string;
  "Registro solución 2": string;
  "Registro solución 3": string;
}

export interface EventFilters {
  search?: string;
  tipo?: string;
  ubicacion?: string;
  responsable?: string;
  estado?: string;
  prioridad?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface EventSortOptions {
  field: 'fecha' | 'prioridad' | 'estado' | 'tipo';
  order: 'asc' | 'desc';
}

export interface EventStatistics {
  totalEvents: number;
  completedEvents: number;
  pendingEvents: number;
  inProgressEvents: number;
  avgCompletionTime: number;
  totalCost: number;
}

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
  title: string;
}

export interface EventComparison {
  eventMedia: MediaItem[];
  solutionMedia: MediaItem[];
  selectedEventIndex: number;
  selectedSolutionIndex: number;
}