"use client";

import { CheckCircle2, Copy, MoreVertical, Star, Trash2 } from "lucide-react";
import type { Ejercicio, Rutina } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RutinaCardProps {
  rutina: Rutina;
  ejercicios: Ejercicio[];
  onActivar: () => void;
  onClonar: () => void;
  onEliminar: () => void;
  onEditar: () => void;
}

export function RutinaCard({
  rutina,
  ejercicios,
  onActivar,
  onClonar,
  onEliminar,
  onEditar,
}: RutinaCardProps) {
  const totalEjercicios = rutina.dias.reduce((total, dia) => total + dia.ejercicios.length, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {rutina.activa && <Badge>Activa</Badge>}
            <Badge variant="outline">{rutina.dias.length} días</Badge>
            <Badge variant="outline">{totalEjercicios} ejercicios</Badge>
          </div>
          <CardTitle className="truncate text-lg">{rutina.nombre}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Acciones de rutina">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onActivar}>
              <Star className="mr-2 h-4 w-4" /> Marcar activa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onClonar}>
              <Copy className="mr-2 h-4 w-4" /> Clonar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEliminar} className="text-red-400 focus:text-red-300">
              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-2">
          {rutina.dias.map((dia) => (
            <div key={`${rutina.id}-${dia.dia}-${dia.nombre}`} className="rounded-lg border border-borde bg-fondo p-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4 text-primario" />
                {dia.dia}
              </div>
              <p className="mt-1 text-sm text-secundario">{dia.nombre}</p>
              <p className="mt-2 text-xs text-secundario">
                {dia.ejercicios
                  .slice()
                  .sort((a, b) => a.orden - b.orden)
                  .slice(0, 3)
                  .map((item) => ejercicios.find((ejercicio) => ejercicio.id === item.ejercicioId)?.nombre)
                  .filter(Boolean)
                  .join(", ") || "Sin ejercicios"}
              </p>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full" onClick={onEditar}>
          Editar rutina
        </Button>
      </CardContent>
    </Card>
  );
}
