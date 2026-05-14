"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, Flame, Plus, Weight } from "lucide-react";
import type { Ejercicio, RegistroDia, Rutina } from "@/lib/types";
import {
  agruparSesiones,
  calcularRacha,
  diaActual,
  fechaCompleta,
  volumenRegistro,
} from "@/lib/utils";
import { inicializarStorage, storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RegistroDiario } from "@/components/RegistroDiario";

export default function DashboardPage() {
  const [rutina, setRutina] = useState<Rutina | undefined>();
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [registros, setRegistros] = useState<RegistroDia[]>([]);
  const [registroOpen, setRegistroOpen] = useState(false);

  function cargar() {
    setRutina(storage.rutinas.activa());
    setEjercicios(storage.ejercicios.listar());
    setRegistros(storage.registros.listar());
  }

  useEffect(() => {
    inicializarStorage();
    cargar();
  }, []);

  const hoy = diaActual();
  const diaRutina = rutina?.dias.find((dia) => dia.dia === hoy) ?? rutina?.dias[0];

  const resumen = useMemo(() => {
    const inicioSemana = new Date();
    const dia = inicioSemana.getDay() || 7;
    inicioSemana.setDate(inicioSemana.getDate() - dia + 1);
    inicioSemana.setHours(0, 0, 0, 0);
    const registrosSemana = registros.filter((registro) => new Date(registro.fecha) >= inicioSemana);
    const diasEntrenados = new Set(registrosSemana.map((registro) => registro.fecha.slice(0, 10))).size;
    const volumen = registrosSemana.reduce((total, registro) => total + volumenRegistro(registro), 0);

    return {
      diasEntrenados,
      volumen,
      racha: calcularRacha(registros),
    };
  }, [registros]);

  const sesiones = agruparSesiones(registros).slice(0, 3);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:py-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primario">{fechaCompleta(new Date().toISOString())}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Hoy toca entrenar</h1>
          <p className="mt-2 text-secundario">
            {diaRutina ? `${diaRutina.dia} · ${diaRutina.nombre}` : "No hay rutina activa todavía."}
          </p>
        </div>
        <Button size="lg" className="w-full lg:w-auto" onClick={() => setRegistroOpen(true)}>
          <Plus className="h-5 w-5" /> Registrar entrenamiento de hoy
        </Button>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Días entrenados</CardTitle>
            <CalendarCheck className="h-5 w-5 text-primario" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{resumen.diasEntrenados}/7</p>
            <Progress className="mt-4" value={(resumen.diasEntrenados / 7) * 100} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Volumen semanal</CardTitle>
            <Weight className="h-5 w-5 text-primario" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Math.round(resumen.volumen).toLocaleString("es-AR")} kg</p>
            <p className="mt-2 text-sm text-secundario">Peso x reps acumulado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Racha actual</CardTitle>
            <Flame className="h-5 w-5 text-primario" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{resumen.racha} días</p>
            <p className="mt-2 text-sm text-secundario">Entrenamientos consecutivos</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Entrenamiento de hoy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {diaRutina ? (
              diaRutina.ejercicios
                .slice()
                .sort((a, b) => a.orden - b.orden)
                .map((item) => {
                  const ejercicio = ejercicios.find((actual) => actual.id === item.ejercicioId);
                  if (!ejercicio) return null;

                  return (
                    <div key={item.ejercicioId} className="flex items-center justify-between gap-3 rounded-lg border border-borde bg-fondo p-3">
                      <div className="min-w-0">
                        <p className="font-semibold">{ejercicio.nombre}</p>
                        <p className="truncate text-sm text-secundario">{ejercicio.detalle}</p>
                      </div>
                      <Badge variant="outline">{item.series}x{item.repsObjetivo}</Badge>
                    </div>
                  );
                })
            ) : (
              <p className="text-sm text-secundario">Creá una rutina en la sección Rutinas.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas sesiones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sesiones.map((sesion) => (
              <div key={sesion.id} className="rounded-lg border border-borde bg-fondo p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{sesion.dia}</p>
                    <p className="text-sm text-secundario">{fechaCompleta(sesion.fecha)}</p>
                  </div>
                  <Badge variant="outline">{sesion.registros.length} ejercicios</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <RegistroDiario
        open={registroOpen}
        onOpenChange={setRegistroOpen}
        rutina={rutina}
        ejercicios={ejercicios}
        onSaved={cargar}
      />
    </div>
  );
}
