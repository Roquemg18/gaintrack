import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { DiaNombre, RegistroDia, SesionAgrupada } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const diasSemana: DiaNombre[] = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
]

export const gruposMusculares = [
  "Todos",
  "Pecho",
  "Espalda",
  "Hombros",
  "Bíceps",
  "Tríceps",
  "Piernas",
  "Core",
  "Personalizado",
]

export function crearId(prefix = "id") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function diaActual(): DiaNombre {
  const index = new Date().getDay()
  const mapa: DiaNombre[] = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ]

  return mapa[index]
}

export function fechaCorta(fecha: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(fecha))
}

export function fechaCompleta(fecha: string) {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(fecha))
}

export function volumenRegistro(registro: RegistroDia) {
  return registro.series.reduce((total, serie) => total + serie.peso * serie.reps, 0)
}

export function agruparSesiones(registros: RegistroDia[]): SesionAgrupada[] {
  const grupos = registros.reduce<Record<string, SesionAgrupada>>((acc, registro) => {
    const diaKey = registro.fecha.slice(0, 10)
    const key = `${diaKey}-${registro.rutinaId}-${registro.dia}`

    if (!acc[key]) {
      acc[key] = {
        id: key,
        fecha: registro.fecha,
        rutinaId: registro.rutinaId,
        dia: registro.dia,
        registros: [],
      }
    }

    acc[key].registros.push(registro)
    return acc
  }, {})

  return Object.values(grupos).sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
  )
}

export function calcularRacha(registros: RegistroDia[]) {
  const dias = Array.from(new Set(registros.map((registro) => registro.fecha.slice(0, 10)))).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  )

  if (dias.length === 0) return 0

  let racha = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  for (let index = 0; index < 30; index += 1) {
    const iso = cursor.toISOString().slice(0, 10)

    if (dias.includes(iso)) {
      racha += 1
    } else if (racha > 0 || index > 1) {
      break
    }

    cursor.setDate(cursor.getDate() - 1)
  }

  return racha
}
