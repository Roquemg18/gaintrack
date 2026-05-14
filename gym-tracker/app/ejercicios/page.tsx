"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { Ejercicio } from "@/lib/types";
import { gruposMusculares } from "@/lib/utils";
import { inicializarStorage, storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EjercicioItem } from "@/components/EjercicioItem";

const inputClass = "h-12 w-full rounded-lg border border-borde bg-fondo px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

export default function EjerciciosPage() {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [grupo, setGrupo] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    detalle: "",
    grupoMuscular: "Pecho",
    icono: "Dumbbell",
  });

  useEffect(() => {
    inicializarStorage();
    setEjercicios(storage.ejercicios.listar());
  }, []);

  const filtrados = useMemo(() => {
    return ejercicios.filter((ejercicio) => {
      const coincideGrupo = grupo === "Todos" || ejercicio.grupoMuscular === grupo;
      const texto = `${ejercicio.nombre} ${ejercicio.detalle}`.toLowerCase();
      return coincideGrupo && texto.includes(busqueda.toLowerCase());
    });
  }, [busqueda, ejercicios, grupo]);

  function crearEjercicio() {
    if (!form.nombre.trim()) return;
    storage.ejercicios.crear({
      nombre: form.nombre.trim(),
      detalle: form.detalle.trim() || "Ejercicio personalizado.",
      grupoMuscular: form.grupoMuscular,
      icono: form.icono.trim() || "Dumbbell",
    });
    setEjercicios(storage.ejercicios.listar());
    setForm({ nombre: "", detalle: "", grupoMuscular: "Pecho", icono: "Dumbbell" });
    setOpen(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:py-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primario">Biblioteca</p>
          <h1 className="text-2xl font-bold tracking-tight">Ejercicios</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> Crear ejercicio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo ejercicio</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <input className={inputClass} placeholder="Nombre" value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} />
              <textarea className="min-h-24 w-full rounded-lg border border-borde bg-fondo px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Detalle técnico" value={form.detalle} onChange={(event) => setForm({ ...form, detalle: event.target.value })} />
              <select className={inputClass} value={form.grupoMuscular} onChange={(event) => setForm({ ...form, grupoMuscular: event.target.value })}>
                {gruposMusculares.filter((item) => item !== "Todos").map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <input className={inputClass} placeholder="Icono Lucide, ej: Dumbbell" value={form.icono} onChange={(event) => setForm({ ...form, icono: event.target.value })} />
              <Button className="w-full" onClick={crearEjercicio}>Guardar ejercicio</Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Buscar y filtrar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <input className={inputClass} placeholder="Buscar por nombre o detalle" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} />
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

      <div className="grid gap-3 md:grid-cols-2">
        {filtrados.map((ejercicio) => (
          <EjercicioItem key={ejercicio.id} ejercicio={ejercicio} />
        ))}
      </div>
    </div>
  );
}
