"use client";

import { useEffect, useMemo, useState } from "react";
import type { Ejercicio, RegistroDia, SesionAgrupada } from "@/lib/types";
import {
  agruparSesiones,
  fechaCompleta,
  gruposMusculares,
  volumenRegistro,
} from "@/lib/utils";
import { inicializarStorage, storage } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraficoProgreso } from "@/components/GraficoProgreso";

const inputClass = "h-12 w-full rounded-lg border border-borde bg-fondo px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

export default function HistorialPage() {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [registros, setRegistros] = useState<RegistroDia[]>([]);
  const [grupo, setGrupo] = useState("Todos");
  const [ejercicioFiltro, setEjercicioFiltro] = useState("todos");
  const [ejercicioGrafico, setEjercicioGrafico] = useState("");
  const [sesionActiva, setSesionActiva] = useState<SesionAgrupada | null>(null);

  useEffect(() => {
    inicializarStorage();
    const ejerciciosGuardados = storage.ejercicios.listar();
    setEjercicios(ejerciciosGuardados);
    setRegistros(storage.registros.listar());
    setEjercicioGrafico(ejerciciosGuardados[0]?.id ?? "");
  }, []);

  const registrosFiltrados = useMemo(() => {
    return registros.filter((registro) => {
      const ejercicio = ejercicios.find((item) => item.id === registro.ejercicioId);
      const coincideEjercicio = ejercicioFiltro === "todos" || registro.ejercicioId === ejercicioFiltro;
      const coincideGrupo = grupo === "Todos" || ejercicio?.grupoMuscular === grupo;
      return coincideEjercicio && coincideGrupo;
    });
  }, [ejercicioFiltro, ejercicios, grupo, registros]);

  const sesiones = agruparSesiones(registrosFiltrados);
  const ejercicioSeleccionado = ejercicios.find((ejercicio) => ejercicio.id === ejercicioGrafico);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:py-8">
      <header>
        <p className="text-sm font-medium text-primario">Progreso</p>
        <h1 className="text-2xl font-bold tracking-tight">Historial</h1>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <CardTitle>Gráfico de peso máximo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={ejercicioGrafico} onValueChange={setEjercicioGrafico}>
              <SelectTrigger>
                <SelectValue placeholder="Elegí ejercicio" />
              </SelectTrigger>
              <SelectContent>
                {ejercicios.map((ejercicio) => (
                  <SelectItem key={ejercicio.id} value={ejercicio.id}>
                    {ejercicio.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <GraficoProgreso registros={registros} ejercicio={ejercicioSeleccionado} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              className={inputClass}
              placeholder="Filtrar por ejercicio"
              value={ejercicioFiltro === "todos" ? "" : ejercicios.find((ejercicio) => ejercicio.id === ejercicioFiltro)?.nombre ?? ""}
              onChange={(event) => {
                const match = ejercicios.find((ejercicio) =>
                  ejercicio.nombre.toLowerCase().includes(event.target.value.toLowerCase()),
                );
                setEjercicioFiltro(event.target.value ? match?.id ?? "sin-resultados" : "todos");
              }}
            />
            <Select value={ejercicioFiltro} onValueChange={setEjercicioFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los ejercicios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los ejercicios</SelectItem>
                {ejercicios.map((ejercicio) => (
                  <SelectItem key={ejercicio.id} value={ejercicio.id}>
                    {ejercicio.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tabs value={grupo} onValueChange={setGrupo}>
              <div className="overflow-x-auto pb-1">
                <TabsList className="w-max">
                  {gruposMusculares.map((item) => (
                    <TabsTrigger key={item} value={item}>{item}</TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sesiones pasadas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sesiones.map((sesion) => {
            const volumen = sesion.registros.reduce((total, registro) => total + volumenRegistro(registro), 0);

            return (
              <button
                key={sesion.id}
                className="rounded-lg border border-borde bg-fondo p-4 text-left transition duration-200 hover:border-primario hover:bg-hover"
                onClick={() => setSesionActiva(sesion)}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{sesion.dia}</p>
                  <Badge variant="outline">{Math.round(volumen).toLocaleString("es-AR")} kg</Badge>
                </div>
                <p className="mt-1 text-sm text-secundario">{fechaCompleta(sesion.fecha)}</p>
                <p className="mt-3 text-sm text-secundario">{sesion.registros.length} ejercicios registrados</p>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Dialog open={Boolean(sesionActiva)} onOpenChange={(open) => !open && setSesionActiva(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{sesionActiva?.dia}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {sesionActiva?.registros.map((registro) => {
              const ejercicio = ejercicios.find((item) => item.id === registro.ejercicioId);
              return (
                <div key={registro.id} className="rounded-lg border border-borde bg-fondo p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{ejercicio?.nombre ?? "Ejercicio"}</p>
                    <Badge variant="outline">Sensación {registro.sensacion}/5</Badge>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {registro.series.map((serie) => (
                      <div key={serie.numero} className="flex justify-between rounded-md bg-panel px-3 py-2 text-sm">
                        <span>Serie {serie.numero}</span>
                        <span>{serie.reps} reps · {serie.peso} kg</span>
                      </div>
                    ))}
                  </div>
                  {registro.notas && <p className="mt-3 text-sm text-secundario">{registro.notas}</p>}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
