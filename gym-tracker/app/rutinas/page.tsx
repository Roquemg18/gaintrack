"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, CalendarX, CheckCircle2, Plus, Save, Trash2 } from "lucide-react";
import type { DiaDeSemana, DiaNombre, EjercicioEnDia, Rutina } from "@/lib/types";
import { crearId, diasSemana } from "@/lib/utils";
import { inicializarStorage, storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EjercicioItem } from "@/components/EjercicioItem";
import { RutinaCard } from "@/components/RutinaCard";
import { NumericInput } from "@/components/NumericInput";

const inputClass = "h-12 w-full rounded-lg border border-borde bg-fondo px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

interface DiaWizard extends DiaDeSemana {
  descanso: boolean;
}

function crearDiasWizard(): DiaWizard[] {
  return diasSemana.map((dia) => ({
    dia,
    nombre: dia,
    ejercicios: [],
    descanso: false,
  }));
}

function numeroEntero(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export default function RutinasPage() {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [ejercicios, setEjercicios] = useState(storage.ejercicios.listar());
  const [nombreNueva, setNombreNueva] = useState("");
  const [creandoRutina, setCreandoRutina] = useState(false);
  const [diaWizardIndex, setDiaWizardIndex] = useState(0);
  const [diasWizard, setDiasWizard] = useState<DiaWizard[]>(crearDiasWizard);
  const [busquedaWizard, setBusquedaWizard] = useState("");
  const [ejercicioWizardId, setEjercicioWizardId] = useState("");
  const [nombreEjercicioWizard, setNombreEjercicioWizard] = useState("");
  const [seriesWizard, setSeriesWizard] = useState("0");
  const [rutinaEditadaId, setRutinaEditadaId] = useState<string>("");
  const [rutinaAEliminar, setRutinaAEliminar] = useState<string>("");
  const [nuevoDia, setNuevoDia] = useState<DiaNombre>("Lunes");
  const [busquedaEjercicio, setBusquedaEjercicio] = useState("");

  useEffect(() => {
    inicializarStorage();
    const rutinasGuardadas = storage.rutinas.listar();
    setRutinas(rutinasGuardadas);
    setEjercicios(storage.ejercicios.listar());
    setRutinaEditadaId(rutinasGuardadas[0]?.id ?? "");
  }, []);

  const rutinaEditada = rutinas.find((rutina) => rutina.id === rutinaEditadaId);
  const diaWizard = diasWizard[diaWizardIndex];
  const ejercicioWizard = ejercicios.find((ejercicio) => ejercicio.id === ejercicioWizardId);

  const ejerciciosFiltrados = useMemo(() => {
    const query = busquedaEjercicio.toLowerCase();
    return ejercicios.filter((ejercicio) =>
      `${ejercicio.nombre} ${ejercicio.detalle} ${ejercicio.grupoMuscular}`.toLowerCase().includes(query),
    );
  }, [busquedaEjercicio, ejercicios]);

  const ejerciciosWizardFiltrados = useMemo(() => {
    const query = busquedaWizard.toLowerCase();
    return ejercicios.filter((ejercicio) =>
      `${ejercicio.nombre} ${ejercicio.detalle} ${ejercicio.grupoMuscular}`.toLowerCase().includes(query),
    );
  }, [busquedaWizard, ejercicios]);

  function refrescar() {
    const nuevas = storage.rutinas.listar();
    setRutinas(nuevas);
    if (!nuevas.some((rutina) => rutina.id === rutinaEditadaId)) {
      setRutinaEditadaId(nuevas[0]?.id ?? "");
    }
  }

  function actualizarRutina(rutina: Rutina) {
    storage.rutinas.actualizar(rutina);
    setRutinas(storage.rutinas.listar());
  }

  function crearRutina() {
    setNombreNueva((nombre) => nombre.trim() || "Rutina nueva");
    setDiasWizard(crearDiasWizard());
    setDiaWizardIndex(0);
    setBusquedaWizard("");
    setEjercicioWizardId("");
    setNombreEjercicioWizard("");
    setSeriesWizard("0");
    setCreandoRutina(true);
  }

  function actualizarDiaWizard(updater: (dia: DiaWizard) => DiaWizard) {
    setDiasWizard((actual) =>
      actual.map((dia, index) => (index === diaWizardIndex ? updater(dia) : dia)),
    );
  }

  function avanzarDiaWizard() {
    setBusquedaWizard("");
    setEjercicioWizardId("");
    setNombreEjercicioWizard("");
    setSeriesWizard("0");
    setDiaWizardIndex((index) => Math.min(index + 1, diasSemana.length - 1));
  }

  function agregarEjercicioWizard() {
    const nombreManual = nombreEjercicioWizard.trim();
    if (!ejercicioWizardId && !nombreManual) return;

    let ejercicioId = ejercicioWizardId;

    if (!ejercicioId) {
      const ejercicioExistente = ejercicios.find(
        (ejercicio) => ejercicio.nombre.toLowerCase() === nombreManual.toLowerCase(),
      );

      if (ejercicioExistente) {
        ejercicioId = ejercicioExistente.id;
      } else {
        const nuevoEjercicio = storage.ejercicios.crear({
          nombre: nombreManual,
          detalle: "Ejercicio personalizado creado desde una rutina.",
          grupoMuscular: "Personalizado",
          icono: "Dumbbell",
        });
        ejercicioId = nuevoEjercicio.id;
        setEjercicios(storage.ejercicios.listar());
      }
    }

    actualizarDiaWizard((dia) => ({
      ...dia,
      descanso: false,
      nombre: dia.nombre === "Descanso" ? dia.dia : dia.nombre,
      ejercicios: [
        ...dia.ejercicios,
        {
          ejercicioId,
          orden: dia.ejercicios.length + 1,
          series: numeroEntero(seriesWizard),
          repsObjetivo: 0,
        },
      ],
    }));
    setBusquedaWizard("");
    setEjercicioWizardId("");
    setNombreEjercicioWizard("");
    setSeriesWizard("0");
  }

  function quitarEjercicioWizard(indexToRemove: number) {
    actualizarDiaWizard((dia) => ({
      ...dia,
      ejercicios: dia.ejercicios
        .filter((_, index) => index !== indexToRemove)
        .map((item, index) => ({ ...item, orden: index + 1 })),
    }));
  }

  function finalizarDiaWizard() {
    if (diaWizardIndex === diasSemana.length - 1) {
      finalizarRutinaWizard();
      return;
    }
    avanzarDiaWizard();
  }

  function asignarDescansoWizard() {
    actualizarDiaWizard((dia) => ({
      ...dia,
      nombre: "Descanso",
      ejercicios: [],
      descanso: true,
    }));

    if (diaWizardIndex < diasSemana.length - 1) {
      avanzarDiaWizard();
    }
  }

  function finalizarRutinaWizard() {
    const id = crearId("rutina");
    const nuevaRutina: Rutina = {
      id,
      nombre: nombreNueva.trim() || "Rutina nueva",
      dias: diasWizard.map(({ descanso, ...dia }) => ({
        ...dia,
        nombre: descanso ? "Descanso" : dia.nombre,
      })),
      creadaEn: new Date().toISOString(),
      activa: true,
    };
    const rutinasActualizadas = [
      ...storage.rutinas.listar().map((rutina) => ({ ...rutina, activa: false })),
      nuevaRutina,
    ];

    storage.rutinas.guardar(rutinasActualizadas);
    setRutinas(rutinasActualizadas);
    setRutinaEditadaId(id);
    setNombreNueva("");
    setCreandoRutina(false);
    setDiasWizard(crearDiasWizard());
    setDiaWizardIndex(0);
  }

  function agregarDia() {
    if (!rutinaEditada) return;
    const existe = rutinaEditada.dias.some((dia) => dia.dia === nuevoDia);
    const rutinaActualizada: Rutina = {
      ...rutinaEditada,
      dias: [
        ...rutinaEditada.dias,
        {
          dia: nuevoDia,
          nombre: existe ? `${nuevoDia} extra` : `Día de ${nuevoDia.toLowerCase()}`,
          ejercicios: [],
        },
      ],
    };
    actualizarRutina(rutinaActualizada);
  }

  function actualizarNombreDia(index: number, nombre: string) {
    if (!rutinaEditada) return;
    actualizarRutina({
      ...rutinaEditada,
      dias: rutinaEditada.dias.map((dia, diaIndex) => (diaIndex === index ? { ...dia, nombre } : dia)),
    });
  }

  function agregarEjercicio(diaIndex: number, ejercicioId: string) {
    if (!rutinaEditada) return;
    const dias = rutinaEditada.dias.map((dia, index) => {
      if (index !== diaIndex) return dia;
      const item: EjercicioEnDia = {
        ejercicioId,
        orden: dia.ejercicios.length + 1,
        series: 3,
        repsObjetivo: 10,
      };
      return { ...dia, ejercicios: [...dia.ejercicios, item] };
    });
    actualizarRutina({ ...rutinaEditada, dias });
  }

  function actualizarEjercicio(diaIndex: number, ejercicioIndex: number, campo: "series" | "repsObjetivo", valor: string) {
    if (!rutinaEditada) return;
    const numero = Number.parseInt(valor, 10);
    const valorSeguro = Number.isFinite(numero) && numero > 0 ? numero : 1;

    actualizarRutina({
      ...rutinaEditada,
      dias: rutinaEditada.dias.map((dia, index) =>
        index === diaIndex
          ? {
              ...dia,
              ejercicios: dia.ejercicios.map((item, itemIndex) =>
                itemIndex === ejercicioIndex ? { ...item, [campo]: valorSeguro } : item,
              ),
            }
          : dia,
      ),
    });
  }

  function moverEjercicio(diaIndex: number, ejercicioIndex: number, direccion: -1 | 1) {
    if (!rutinaEditada) return;
    const dias = rutinaEditada.dias.map((dia, index) => {
      if (index !== diaIndex) return dia;
      const ejerciciosDia = [...dia.ejercicios].sort((a, b) => a.orden - b.orden);
      const destino = ejercicioIndex + direccion;
      if (destino < 0 || destino >= ejerciciosDia.length) return dia;
      [ejerciciosDia[ejercicioIndex], ejerciciosDia[destino]] = [ejerciciosDia[destino], ejerciciosDia[ejercicioIndex]];
      return {
        ...dia,
        ejercicios: ejerciciosDia.map((item, ordenIndex) => ({ ...item, orden: ordenIndex + 1 })),
      };
    });
    actualizarRutina({ ...rutinaEditada, dias });
  }

  function quitarEjercicio(diaIndex: number, ejercicioIndex: number) {
    if (!rutinaEditada) return;
    actualizarRutina({
      ...rutinaEditada,
      dias: rutinaEditada.dias.map((dia, index) =>
        index === diaIndex
          ? {
              ...dia,
              ejercicios: dia.ejercicios
                .filter((_, itemIndex) => itemIndex !== ejercicioIndex)
                .map((item, ordenIndex) => ({ ...item, orden: ordenIndex + 1 })),
            }
          : dia,
      ),
    });
  }

  function eliminarRutinaConfirmada() {
    storage.rutinas.eliminar(rutinaAEliminar);
    setRutinaAEliminar("");
    refrescar();
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:py-8">
      <header>
        <p className="text-sm font-medium text-primario">Planificación</p>
        <h1 className="text-2xl font-bold tracking-tight">Rutinas</h1>
      </header>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Crear rutina paso a paso</CardTitle>
              <p className="mt-1 text-sm text-secundario">
                Arranca en lunes y avanza dia por dia hasta completar la semana.
              </p>
            </div>
            {creandoRutina && (
              <Button onClick={finalizarRutinaWizard}>
                <Save className="h-4 w-4" /> Finalizar rutina
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!creandoRutina ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                className={inputClass}
                placeholder="Nombre de la nueva rutina"
                value={nombreNueva}
                onChange={(event) => setNombreNueva(event.target.value)}
              />
              <Button className="sm:w-auto" onClick={crearRutina}>
                <Plus className="h-4 w-4" /> Crear rutina
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {diasWizard.map((dia, index) => (
                  <button
                    key={dia.dia}
                    type="button"
                    className={`flex min-h-12 min-w-28 flex-col items-start justify-center rounded-lg border px-3 text-left transition ${
                      index === diaWizardIndex
                        ? "border-primario bg-primario/15"
                        : "border-borde bg-fondo hover:bg-hover"
                    }`}
                    onClick={() => setDiaWizardIndex(index)}
                  >
                    <span className="text-sm font-semibold">{dia.dia}</span>
                    <span className="text-xs text-secundario">
                      {dia.descanso ? "Descanso" : `${dia.ejercicios.length} ejercicios`}
                    </span>
                  </button>
                ))}
              </div>

              <section className="rounded-lg border border-borde bg-fondo p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Badge variant="outline">{diaWizard?.dia}</Badge>
                    <h2 className="mt-2 text-xl font-bold">{diaWizard?.nombre}</h2>
                  </div>
                  <input
                    className={`${inputClass} sm:max-w-xs`}
                    value={diaWizard?.nombre ?? ""}
                    onChange={(event) =>
                      actualizarDiaWizard((dia) => ({
                        ...dia,
                        nombre: event.target.value,
                        descanso: false,
                      }))
                    }
                    aria-label="Nombre del dia"
                  />
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_1fr_160px_auto]">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-secundario">Buscar ejercicio</p>
                    <input
                      className={inputClass}
                      placeholder="Nombre del buscador"
                      value={busquedaWizard}
                      onChange={(event) => setBusquedaWizard(event.target.value)}
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-secundario">Nombre del ejercicio</p>
                    <input
                      className={inputClass}
                      placeholder={ejercicioWizard?.nombre ?? "Escribi un ejercicio nuevo"}
                      value={nombreEjercicioWizard}
                      onChange={(event) => {
                        setNombreEjercicioWizard(event.target.value);
                        setEjercicioWizardId("");
                      }}
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-secundario">Series</p>
                    <NumericInput
                      value={seriesWizard}
                      onChange={setSeriesWizard}
                      ariaLabel="Cantidad de series"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full" onClick={agregarEjercicioWizard}>
                      <Plus className="h-4 w-4" /> Agregar
                    </Button>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {ejerciciosWizardFiltrados.slice(0, 6).map((ejercicio) => (
                    <EjercicioItem
                      key={`wizard-${ejercicio.id}`}
                      ejercicio={ejercicio}
                      compacto
                      selected={ejercicio.id === ejercicioWizardId}
                      onClick={() => {
                        setEjercicioWizardId(ejercicio.id);
                        setNombreEjercicioWizard(ejercicio.nombre);
                      }}
                    />
                  ))}
                </div>

                <div className="mt-5 space-y-2">
                  {diaWizard?.ejercicios.length ? (
                    diaWizard.ejercicios
                      .slice()
                      .sort((a, b) => a.orden - b.orden)
                      .map((item, index) => {
                        const ejercicio = ejercicios.find((actual) => actual.id === item.ejercicioId);
                        if (!ejercicio) return null;

                        return (
                          <div key={`${item.ejercicioId}-${index}`} className="flex items-center gap-3 rounded-lg border border-borde bg-panel p-3">
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold">{ejercicio.nombre}</p>
                              <p className="text-sm text-secundario">{item.series} series</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => quitarEjercicioWizard(index)} aria-label="Quitar ejercicio">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })
                  ) : (
                    <div className="rounded-lg border border-dashed border-borde p-4 text-sm text-secundario">
                      Todavia no cargaste ejercicios para este dia.
                    </div>
                  )}
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  <Button variant="outline" onClick={finalizarDiaWizard}>
                    <CheckCircle2 className="h-4 w-4" /> Finalizar dia
                  </Button>
                  <Button variant="outline" onClick={asignarDescansoWizard}>
                    <CalendarX className="h-4 w-4" /> Asignar como dia de descanso
                  </Button>
                  <Button onClick={finalizarRutinaWizard}>
                    <Save className="h-4 w-4" /> Finalizar rutina
                  </Button>
                </div>
              </section>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <div className="space-y-4">
          {rutinas.map((rutina) => (
            <RutinaCard
              key={rutina.id}
              rutina={rutina}
              ejercicios={ejercicios}
              onEditar={() => setRutinaEditadaId(rutina.id)}
              onActivar={() => {
                storage.rutinas.activar(rutina.id);
                refrescar();
              }}
              onClonar={() => {
                storage.rutinas.clonar(rutina.id);
                refrescar();
              }}
              onEliminar={() => setRutinaAEliminar(rutina.id)}
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>{rutinaEditada?.nombre ?? "Sin rutina seleccionada"}</CardTitle>
              {rutinaEditada?.activa && <Badge>Rutina activa</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {rutinaEditada ? (
              <>
                <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
                  <input
                    className={inputClass}
                    value={rutinaEditada.nombre}
                    onChange={(event) => actualizarRutina({ ...rutinaEditada, nombre: event.target.value })}
                  />
                  <select className={inputClass} value={nuevoDia} onChange={(event) => setNuevoDia(event.target.value as DiaNombre)}>
                    {diasSemana.map((dia) => (
                      <option key={dia} value={dia}>{dia}</option>
                    ))}
                  </select>
                  <Button onClick={agregarDia}>
                    <Plus className="h-4 w-4" /> Día
                  </Button>
                </div>

                <input
                  className={inputClass}
                  placeholder="Buscar ejercicio por nombre, grupo o detalle"
                  value={busquedaEjercicio}
                  onChange={(event) => setBusquedaEjercicio(event.target.value)}
                />

                <div className="space-y-4">
                  {rutinaEditada.dias.map((dia, diaIndex) => (
                    <section key={`${dia.dia}-${diaIndex}`} className="rounded-lg border border-borde bg-fondo p-4">
                      <div className="grid gap-3 md:grid-cols-[160px_1fr]">
                        <div>
                          <Badge variant="outline">{dia.dia}</Badge>
                          <input
                            className={`${inputClass} mt-3`}
                            value={dia.nombre}
                            onChange={(event) => actualizarNombreDia(diaIndex, event.target.value)}
                          />
                        </div>
                        <div className="space-y-3">
                          {dia.ejercicios
                            .slice()
                            .sort((a, b) => a.orden - b.orden)
                            .map((item, ejercicioIndex) => {
                              const ejercicio = ejercicios.find((actual) => actual.id === item.ejercicioId);
                              if (!ejercicio) return null;

                              return (
                                <div key={`${item.ejercicioId}-${ejercicioIndex}`} className="rounded-lg border border-borde bg-panel p-3">
                                  <EjercicioItem ejercicio={ejercicio} compacto />
                                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_auto_auto_auto]">
                                    <div>
                                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-secundario">Series</p>
                                      <NumericInput value={item.series} onChange={(value) => actualizarEjercicio(diaIndex, ejercicioIndex, "series", value)} ariaLabel="Series planeadas" />
                                    </div>
                                    <div>
                                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-secundario">Reps</p>
                                      <NumericInput value={item.repsObjetivo} onChange={(value) => actualizarEjercicio(diaIndex, ejercicioIndex, "repsObjetivo", value)} ariaLabel="Reps objetivo" />
                                    </div>
                                    <Button variant="outline" size="icon" onClick={() => moverEjercicio(diaIndex, ejercicioIndex, -1)} aria-label="Subir ejercicio">
                                      <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => moverEjercicio(diaIndex, ejercicioIndex, 1)} aria-label="Bajar ejercicio">
                                      <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => quitarEjercicio(diaIndex, ejercicioIndex)} aria-label="Quitar ejercicio">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}

                          <div className="grid gap-2 sm:grid-cols-2">
                            {ejerciciosFiltrados.slice(0, 6).map((ejercicio) => (
                              <EjercicioItem
                                key={`${diaIndex}-${ejercicio.id}`}
                                ejercicio={ejercicio}
                                compacto
                                onClick={() => agregarEjercicio(diaIndex, ejercicio.id)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-secundario">Creá una rutina para empezar.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(rutinaAEliminar)} onOpenChange={(open) => !open && setRutinaAEliminar("")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar rutina</DialogTitle>
            <DialogDescription>Esta acción borra la rutina local del dispositivo.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRutinaAEliminar("")}>Cancelar</Button>
            <Button variant="destructive" onClick={eliminarRutinaConfirmada}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
