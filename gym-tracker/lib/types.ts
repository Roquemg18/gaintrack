export type Sensacion = 1 | 2 | 3 | 4 | 5;

export type DiaNombre =
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado"
  | "Domingo";

export interface Ejercicio {
  id: string;
  nombre: string;
  detalle: string;
  grupoMuscular: string;
  icono: string;
}

export interface EjercicioEnDia {
  ejercicioId: string;
  orden: number;
  series: number;
  repsObjetivo: number;
}

export interface DiaDeSemana {
  dia: DiaNombre;
  nombre: string;
  ejercicios: EjercicioEnDia[];
}

export interface Rutina {
  id: string;
  nombre: string;
  dias: DiaDeSemana[];
  creadaEn: string;
  activa: boolean;
}

export interface SerieRegistrada {
  numero: number;
  reps: number;
  peso: number;
}

export interface RegistroDia {
  id: string;
  fecha: string;
  rutinaId: string;
  dia: string;
  ejercicioId: string;
  series: SerieRegistrada[];
  sensacion: Sensacion;
  notas: string;
}

export interface SesionAgrupada {
  id: string;
  fecha: string;
  rutinaId: string;
  dia: string;
  registros: RegistroDia[];
}
