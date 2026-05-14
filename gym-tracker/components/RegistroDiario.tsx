"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
import type { DiaDeSemana, Ejercicio, RegistroDia, Rutina, Sensacion } from "@/lib/types";
import { crearId, diaActual } from "@/lib/utils";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SelectorDia } from "@/components/SelectorDia";
import { EjercicioItem } from "@/components/EjercicioItem";
import { NumericInput } from "@/components/NumericInput";

interface RegistroDiarioProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rutina?: Rutina;
  ejercicios: Ejercicio[];
  onSaved: () => void;
}

interface SerieFormulario {
  numero: number;
  reps: string;
  peso: string;
}

const sensaciones: Array<{ value: Sensacion; label: string; emoji: string }> = [
  { value: 1, label: "Muy mal", emoji: "😫" },
  { value: 2, label: "Mal", emoji: "😕" },
  { value: 3, label: "Regular", emoji: "😐" },
  { value: 4, label: "Bien", emoji: "💪" },
  { value: 5, label: "Excelente", emoji: "🔥" },
];

function seriesIniciales(dia?: DiaDeSemana) {
  return (dia?.ejercicios ?? []).reduce<Record<string, SerieFormulario[]>>((acc, item) => {
    acc[item.ejercicioId] = Array.from({ length: item.series }, (_, index) => ({
      numero: index + 1,
      reps: String(item.repsObjetivo),
      peso: "0",
    }));
    return acc;
  }, {});
}

function parseNumero(value: string, entero = false) {
  const normalizado = value.replace(",", ".");
  const numero = entero ? Number.parseInt(normalizado, 10) : Number(normalizado);

  return Number.isFinite(numero) ? numero : 0;
}

export function RegistroDiario({
  open,
  onOpenChange,
  rutina,
  ejercicios,
  onSaved,
}: RegistroDiarioProps) {
  const diaPorDefecto = useMemo(() => {
    const hoy = diaActual();
    return rutina?.dias.find((dia) => dia.dia === hoy) ?? rutina?.dias[0];
  }, [rutina]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(diaPorDefecto?.nombre ?? "");
  const dia = rutina?.dias.find((item) => item.nombre === diaSeleccionado) ?? diaPorDefecto;
  const [seriesPorEjercicio, setSeriesPorEjercicio] = useState<Record<string, SerieFormulario[]>>({});
  const [sensacion, setSensacion] = useState<Sensacion>(4);
  const [notas, setNotas] = useState("");

  useEffect(() => {
    if (open && diaPorDefecto) {
      setDiaSeleccionado(diaPorDefecto.nombre);
      setSeriesPorEjercicio(seriesIniciales(diaPorDefecto));
      setSensacion(4);
      setNotas("");
    }
  }, [diaPorDefecto, open]);

  useEffect(() => {
    if (dia) setSeriesPorEjercicio(seriesIniciales(dia));
  }, [dia, diaSeleccionado]);

  function actualizarSerie(ejercicioId: string, index: number, campo: "reps" | "peso", valor: string) {
    setSeriesPorEjercicio((actual) => ({
      ...actual,
      [ejercicioId]: actual[ejercicioId].map((serie, serieIndex) =>
        serieIndex === index ? { ...serie, [campo]: valor } : serie,
      ),
    }));
  }

  function agregarSerie(ejercicioId: string) {
    setSeriesPorEjercicio((actual) => {
      const series = actual[ejercicioId] ?? [];
      return {
        ...actual,
        [ejercicioId]: [
          ...series,
          {
            numero: series.length + 1,
            reps: series.at(-1)?.reps ?? "8",
            peso: series.at(-1)?.peso ?? "0",
          },
        ],
      };
    });
  }

  function guardar() {
    if (!rutina || !dia) return;

    const fecha = new Date().toISOString();
    const registros: RegistroDia[] = dia.ejercicios.map((item) => ({
      id: crearId("registro"),
      fecha,
      rutinaId: rutina.id,
      dia: dia.nombre,
      ejercicioId: item.ejercicioId,
      series: (seriesPorEjercicio[item.ejercicioId] ?? []).map((serie, index) => ({
        numero: index + 1,
        reps: parseNumero(serie.reps, true),
        peso: parseNumero(serie.peso),
      })),
      sensacion,
      notas,
    }));

    storage.registros.agregarSesion(registros);
    onSaved();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="overflow-y-auto p-4 sm:left-auto sm:right-4 sm:top-4 sm:h-[calc(100vh-2rem)] sm:w-[520px] sm:rounded-lg sm:border">
        <SheetHeader className="pr-10">
          <SheetTitle>Registrar entrenamiento</SheetTitle>
          <SheetDescription>Cargá reps, peso y sensación general de la sesión.</SheetDescription>
        </SheetHeader>

        {!rutina || !dia ? (
          <div className="rounded-lg border border-borde bg-fondo p-4 text-sm text-secundario">
            Creá o activá una rutina para poder registrar entrenamientos.
          </div>
        ) : (
          <div className="space-y-5">
            <SelectorDia dias={rutina.dias} value={diaSeleccionado} onChange={setDiaSeleccionado} />

            <div className="space-y-4">
              {dia.ejercicios
                .slice()
                .sort((a, b) => a.orden - b.orden)
                .map((item) => {
                  const ejercicio = ejercicios.find((actual) => actual.id === item.ejercicioId);
                  if (!ejercicio) return null;
                  const series = seriesPorEjercicio[item.ejercicioId] ?? [];

                  return (
                    <section key={item.ejercicioId} className="rounded-lg border border-borde bg-fondo p-3">
                      <EjercicioItem ejercicio={ejercicio} compacto />
                      <div className="mt-3 space-y-2">
                        <div className="grid grid-cols-[44px_1fr_1fr] gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-secundario">
                          <span>Serie</span>
                          <span>Reps</span>
                          <span>Kilos</span>
                        </div>
                        {series.map((serie, index) => (
                          <div key={`${item.ejercicioId}-${index}`} className="grid grid-cols-[44px_1fr_1fr] items-center gap-2">
                            <span className="text-sm text-secundario">S{index + 1}</span>
                            <NumericInput
                              value={serie.reps}
                              onChange={(value) => actualizarSerie(item.ejercicioId, index, "reps", value)}
                              ariaLabel={`Repeticiones serie ${index + 1}`}
                            />
                            <NumericInput
                              value={serie.peso}
                              onChange={(value) => actualizarSerie(item.ejercicioId, index, "peso", value)}
                              ariaLabel={`Kilos serie ${index + 1}`}
                              suffix="kg"
                              allowDecimal
                              allowNegative
                            />
                          </div>
                        ))}
                      </div>
                      <Button variant="ghost" className="mt-2 w-full" onClick={() => agregarSerie(item.ejercicioId)}>
                        <Plus className="h-4 w-4" /> Agregar serie extra
                      </Button>
                    </section>
                  );
                })}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Sensación</p>
              <div className="grid grid-cols-5 gap-2">
                {sensaciones.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`flex h-14 items-center justify-center rounded-lg border text-xl transition duration-200 ${
                      sensacion === item.value
                        ? "border-primario bg-primario/20"
                        : "border-borde bg-fondo hover:bg-hover"
                    }`}
                    onClick={() => setSensacion(item.value)}
                    aria-label={item.label}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="min-h-24 w-full rounded-lg border border-borde bg-fondo px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Notas opcionales"
              value={notas}
              onChange={(event) => setNotas(event.target.value)}
            />

            <Button size="lg" className="w-full" onClick={guardar}>
              <Save className="h-5 w-5" /> Guardar sesión
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
