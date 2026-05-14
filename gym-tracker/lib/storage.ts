"use client";

import type {
  DiaDeSemana,
  Ejercicio,
  RegistroDia,
  Rutina,
  Sensacion,
} from "@/lib/types";
import { crearId } from "@/lib/utils";

const EJERCICIOS_KEY = "gymtracker:ejercicios";
const RUTINAS_KEY = "gymtracker:rutinas";
const REGISTROS_KEY = "gymtracker:registros";

export const ejerciciosBase: Ejercicio[] = [
  { id: "press-banca", nombre: "Press banca", detalle: "Barra al pecho, escápulas firmes y empuje vertical controlado.", grupoMuscular: "Pecho", icono: "Dumbbell" },
  { id: "press-inclinado", nombre: "Press inclinado", detalle: "Banco a 30 grados, recorrido estable y pecho alto.", grupoMuscular: "Pecho", icono: "TrendingUp" },
  { id: "aperturas-mancuerna", nombre: "Aperturas con mancuernas", detalle: "Codos suaves, estiramiento amplio y cierre sin golpear mancuernas.", grupoMuscular: "Pecho", icono: "MoveHorizontal" },
  { id: "fondos-pecho", nombre: "Fondos para pecho", detalle: "Torso inclinado, hombros abajo y bajada profunda sin dolor.", grupoMuscular: "Pecho", icono: "ArrowDownUp" },
  { id: "cruce-poleas", nombre: "Cruce de poleas", detalle: "Cable alineado, pecho contraído y pausa al frente.", grupoMuscular: "Pecho", icono: "Cable" },
  { id: "flexiones", nombre: "Flexiones", detalle: "Cuerpo en bloque, manos bajo hombros y rango completo.", grupoMuscular: "Pecho", icono: "Activity" },
  { id: "dominadas", nombre: "Dominadas", detalle: "Agarre firme, pecho hacia la barra y control en la bajada.", grupoMuscular: "Espalda", icono: "ArrowUp" },
  { id: "jalon-pecho", nombre: "Jalón al pecho", detalle: "Tirar con codos, pecho alto y sin balancear el torso.", grupoMuscular: "Espalda", icono: "Cable" },
  { id: "remo-barra", nombre: "Remo con barra", detalle: "Bisagra de cadera, espalda neutra y barra hacia el ombligo.", grupoMuscular: "Espalda", icono: "Dumbbell" },
  { id: "remo-mancuerna", nombre: "Remo mancuerna", detalle: "Agarre neutro con mancuerna, codo cerca del cuerpo.", grupoMuscular: "Espalda", icono: "Hand" },
  { id: "remo-sentado", nombre: "Remo sentado", detalle: "Tracción horizontal, pausa atrás y retorno controlado.", grupoMuscular: "Espalda", icono: "Rows3" },
  { id: "pullover-polea", nombre: "Pullover en polea", detalle: "Brazos largos, dorsales activos y torso estable.", grupoMuscular: "Espalda", icono: "Undo2" },
  { id: "peso-muerto", nombre: "Peso muerto", detalle: "Barra pegada, empuje de piernas y espalda neutra.", grupoMuscular: "Espalda", icono: "Weight" },
  { id: "press-militar", nombre: "Press militar", detalle: "Core firme, barra sobre línea media y bloqueo fuerte.", grupoMuscular: "Hombros", icono: "ArrowUpFromLine" },
  { id: "press-arnold", nombre: "Press Arnold", detalle: "Rotación fluida, muñecas alineadas y control arriba.", grupoMuscular: "Hombros", icono: "RotateCw" },
  { id: "laterales", nombre: "Elevaciones laterales", detalle: "Codos guían el movimiento, sin impulso y hombros lejos de orejas.", grupoMuscular: "Hombros", icono: "MoveUpRight" },
  { id: "posteriores", nombre: "Pájaros posteriores", detalle: "Torso inclinado, apertura hacia afuera y pausa atrás.", grupoMuscular: "Hombros", icono: "Bird" },
  { id: "face-pull", nombre: "Face pull", detalle: "Cuerda a la cara, codos altos y rotación externa.", grupoMuscular: "Hombros", icono: "Cable" },
  { id: "encogimientos", nombre: "Encogimientos", detalle: "Subida vertical, pausa arriba y cuello relajado.", grupoMuscular: "Hombros", icono: "ChevronsUp" },
  { id: "curl-barra", nombre: "Curl con barra", detalle: "Codos quietos, muñecas firmes y bajada lenta.", grupoMuscular: "Bíceps", icono: "Dumbbell" },
  { id: "curl-mancuerna", nombre: "Curl alterno", detalle: "Supinación completa, hombros quietos y rango completo.", grupoMuscular: "Bíceps", icono: "Repeat2" },
  { id: "curl-martillo", nombre: "Curl martillo", detalle: "Agarre neutro, codos pegados y antebrazo vertical.", grupoMuscular: "Bíceps", icono: "Hammer" },
  { id: "curl-predicador", nombre: "Curl predicador", detalle: "Brazo apoyado, extensión controlada y sin rebote abajo.", grupoMuscular: "Bíceps", icono: "Armchair" },
  { id: "curl-polea", nombre: "Curl en polea", detalle: "Tensión constante, codos fijos y cierre fuerte.", grupoMuscular: "Bíceps", icono: "Cable" },
  { id: "press-cerrado", nombre: "Press cerrado", detalle: "Agarre cerrado, codos cerca y énfasis en tríceps.", grupoMuscular: "Tríceps", icono: "Dumbbell" },
  { id: "extension-polea", nombre: "Extensión en polea", detalle: "Codos fijos, cuerda separa al final y torso estable.", grupoMuscular: "Tríceps", icono: "Cable" },
  { id: "extension-francesa", nombre: "Extensión francesa", detalle: "Brazos sobre cabeza, codos apuntan al frente y bajada lenta.", grupoMuscular: "Tríceps", icono: "ArrowDownToLine" },
  { id: "fondos-triceps", nombre: "Fondos para tríceps", detalle: "Torso vertical, codos atrás y rango cómodo.", grupoMuscular: "Tríceps", icono: "ArrowDownUp" },
  { id: "patada-triceps", nombre: "Patada de tríceps", detalle: "Hombro estable, extensión completa y pausa al final.", grupoMuscular: "Tríceps", icono: "MoveRight" },
  { id: "sentadilla", nombre: "Sentadilla", detalle: "Pies firmes, rodillas siguen la punta y profundidad controlada.", grupoMuscular: "Piernas", icono: "Gauge" },
  { id: "prensa", nombre: "Prensa", detalle: "Pies al ancho de hombros, bajada profunda y sin despegar cadera.", grupoMuscular: "Piernas", icono: "PanelTop" },
  { id: "zancadas", nombre: "Zancadas", detalle: "Paso largo, torso alto y rodilla estable.", grupoMuscular: "Piernas", icono: "Footprints" },
  { id: "peso-rumano", nombre: "Peso muerto rumano", detalle: "Cadera atrás, rodillas suaves y estiramiento de isquios.", grupoMuscular: "Piernas", icono: "Weight" },
  { id: "curl-femoral", nombre: "Curl femoral", detalle: "Cadera apoyada, flexión completa y retorno lento.", grupoMuscular: "Piernas", icono: "RotateCcw" },
  { id: "extension-cuadriceps", nombre: "Extensión de cuádriceps", detalle: "Pausa arriba, espalda apoyada y bajada controlada.", grupoMuscular: "Piernas", icono: "MoveUp" },
  { id: "gemelos", nombre: "Elevación de gemelos", detalle: "Recorrido amplio, pausa arriba y talón baja controlado.", grupoMuscular: "Piernas", icono: "ChevronsUp" },
  { id: "hip-thrust", nombre: "Hip thrust", detalle: "Mentón bajo, pelvis neutra y bloqueo fuerte arriba.", grupoMuscular: "Piernas", icono: "TrendingUp" },
  { id: "plancha", nombre: "Plancha", detalle: "Glúteos y abdomen activos, respiración controlada.", grupoMuscular: "Core", icono: "Minus" },
  { id: "crunch-polea", nombre: "Crunch en polea", detalle: "Flexión de columna, cadera quieta y tensión constante.", grupoMuscular: "Core", icono: "Cable" },
  { id: "elevaciones-piernas", nombre: "Elevaciones de piernas", detalle: "Pelvis rota al final y bajada sin arquear lumbar.", grupoMuscular: "Core", icono: "ArrowUpFromLine" },
  { id: "rueda-abdominal", nombre: "Rueda abdominal", detalle: "Cadera estable, avance progresivo y retorno con abdomen.", grupoMuscular: "Core", icono: "CircleDot" },
  { id: "pallof", nombre: "Pallof press", detalle: "Resistir rotación, brazos al frente y postura firme.", grupoMuscular: "Core", icono: "Shield" },
  { id: "russian-twist", nombre: "Russian twist", detalle: "Rotación controlada, pecho alto y pies estables.", grupoMuscular: "Core", icono: "RefreshCw" },
];

const rutinaEjemploDias: DiaDeSemana[] = [
  {
    dia: "Lunes",
    nombre: "Pecho y tríceps",
    ejercicios: [
      { ejercicioId: "press-banca", orden: 1, series: 4, repsObjetivo: 8 },
      { ejercicioId: "press-inclinado", orden: 2, series: 3, repsObjetivo: 10 },
      { ejercicioId: "aperturas-mancuerna", orden: 3, series: 3, repsObjetivo: 12 },
      { ejercicioId: "extension-polea", orden: 4, series: 3, repsObjetivo: 12 },
      { ejercicioId: "fondos-triceps", orden: 5, series: 3, repsObjetivo: 10 },
    ],
  },
  {
    dia: "Martes",
    nombre: "Espalda y bíceps",
    ejercicios: [
      { ejercicioId: "dominadas", orden: 1, series: 4, repsObjetivo: 8 },
      { ejercicioId: "remo-barra", orden: 2, series: 4, repsObjetivo: 8 },
      { ejercicioId: "jalon-pecho", orden: 3, series: 3, repsObjetivo: 10 },
      { ejercicioId: "curl-barra", orden: 4, series: 3, repsObjetivo: 10 },
      { ejercicioId: "curl-martillo", orden: 5, series: 3, repsObjetivo: 12 },
    ],
  },
  {
    dia: "Jueves",
    nombre: "Hombros y core",
    ejercicios: [
      { ejercicioId: "press-militar", orden: 1, series: 4, repsObjetivo: 8 },
      { ejercicioId: "laterales", orden: 2, series: 4, repsObjetivo: 12 },
      { ejercicioId: "face-pull", orden: 3, series: 3, repsObjetivo: 15 },
      { ejercicioId: "plancha", orden: 4, series: 3, repsObjetivo: 45 },
      { ejercicioId: "rueda-abdominal", orden: 5, series: 3, repsObjetivo: 10 },
    ],
  },
  {
    dia: "Sábado",
    nombre: "Piernas",
    ejercicios: [
      { ejercicioId: "sentadilla", orden: 1, series: 4, repsObjetivo: 8 },
      { ejercicioId: "prensa", orden: 2, series: 4, repsObjetivo: 10 },
      { ejercicioId: "peso-rumano", orden: 3, series: 3, repsObjetivo: 10 },
      { ejercicioId: "extension-cuadriceps", orden: 4, series: 3, repsObjetivo: 12 },
      { ejercicioId: "gemelos", orden: 5, series: 4, repsObjetivo: 15 },
    ],
  },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function registrosEjemplo(rutinaId: string): RegistroDia[] {
  const hoy = new Date();
  const offsets = [13, 12, 10, 8, 6, 5, 3, 1];

  return offsets.flatMap((offset, sesionIndex) => {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - offset);
    fecha.setHours(18, 30, 0, 0);
    const dia = rutinaEjemploDias[sesionIndex % rutinaEjemploDias.length];
    const progresion = sesionIndex * 1.25;

    return dia.ejercicios.slice(0, 4).map((ejercicio, ejercicioIndex) => ({
      id: crearId("registro"),
      fecha: fecha.toISOString(),
      rutinaId,
      dia: dia.nombre,
      ejercicioId: ejercicio.ejercicioId,
      sensacion: Math.min(5, 3 + (sesionIndex % 3)) as Sensacion,
      notas: sesionIndex % 2 === 0 ? "Buena energía y técnica estable." : "",
      series: Array.from({ length: ejercicio.series }, (_, serieIndex) => ({
        numero: serieIndex + 1,
        reps: Math.max(6, ejercicio.repsObjetivo - (serieIndex % 2)),
        peso: Math.round((25 + ejercicioIndex * 7 + progresion + serieIndex * 1.5) * 2) / 2,
      })),
    }));
  });
}

export function inicializarStorage() {
  if (typeof window === "undefined") return;

  const ejercicios = read<Ejercicio[]>(EJERCICIOS_KEY, []);
  if (ejercicios.length === 0) write(EJERCICIOS_KEY, ejerciciosBase);

  const rutinas = read<Rutina[]>(RUTINAS_KEY, []);
  if (rutinas.length === 0) {
    const rutinaId = "rutina-base";
    const rutina: Rutina = {
      id: rutinaId,
      nombre: "Rutina base 4 días",
      dias: rutinaEjemploDias,
      creadaEn: new Date().toISOString(),
      activa: true,
    };

    write(RUTINAS_KEY, [rutina]);
    write(REGISTROS_KEY, registrosEjemplo(rutinaId));
  }
}

export const storage = {
  ejercicios: {
    listar: () => read<Ejercicio[]>(EJERCICIOS_KEY, ejerciciosBase),
    guardar: (ejercicios: Ejercicio[]) => write(EJERCICIOS_KEY, ejercicios),
    crear: (ejercicio: Omit<Ejercicio, "id">) => {
      const nuevo = { ...ejercicio, id: crearId("ejercicio") };
      const ejercicios = [...storage.ejercicios.listar(), nuevo];
      write(EJERCICIOS_KEY, ejercicios);
      return nuevo;
    },
  },
  rutinas: {
    listar: () => read<Rutina[]>(RUTINAS_KEY, []),
    guardar: (rutinas: Rutina[]) => write(RUTINAS_KEY, rutinas),
    activa: () => storage.rutinas.listar().find((rutina) => rutina.activa),
    crear: (nombre: string) => {
      const nueva: Rutina = {
        id: crearId("rutina"),
        nombre,
        dias: [],
        creadaEn: new Date().toISOString(),
        activa: storage.rutinas.listar().length === 0,
      };
      write(RUTINAS_KEY, [...storage.rutinas.listar(), nueva]);
      return nueva;
    },
    actualizar: (rutina: Rutina) => {
      write(
        RUTINAS_KEY,
        storage.rutinas.listar().map((item) => (item.id === rutina.id ? rutina : item)),
      );
    },
    eliminar: (rutinaId: string) => {
      const restantes = storage.rutinas.listar().filter((rutina) => rutina.id !== rutinaId);
      if (restantes.length > 0 && !restantes.some((rutina) => rutina.activa)) {
        restantes[0].activa = true;
      }
      write(RUTINAS_KEY, restantes);
    },
    clonar: (rutinaId: string) => {
      const rutina = storage.rutinas.listar().find((item) => item.id === rutinaId);
      if (!rutina) return;
      const clon: Rutina = {
        ...rutina,
        id: crearId("rutina"),
        nombre: `${rutina.nombre} copia`,
        creadaEn: new Date().toISOString(),
        activa: false,
      };
      write(RUTINAS_KEY, [...storage.rutinas.listar(), clon]);
    },
    activar: (rutinaId: string) => {
      write(
        RUTINAS_KEY,
        storage.rutinas.listar().map((rutina) => ({ ...rutina, activa: rutina.id === rutinaId })),
      );
    },
  },
  registros: {
    listar: () => read<RegistroDia[]>(REGISTROS_KEY, []),
    guardar: (registros: RegistroDia[]) => write(REGISTROS_KEY, registros),
    agregarSesion: (registros: RegistroDia[]) => {
      write(REGISTROS_KEY, [...storage.registros.listar(), ...registros]);
    },
  },
};
