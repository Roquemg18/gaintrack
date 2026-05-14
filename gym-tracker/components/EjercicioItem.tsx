"use client";

import * as Lucide from "lucide-react";
import type { Ejercicio } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EjercicioItemProps {
  ejercicio: Ejercicio;
  compacto?: boolean;
  action?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export function EjercicioItem({ ejercicio, compacto, action, selected, onClick }: EjercicioItemProps) {
  const Icon =
    (Lucide as unknown as Record<string, Lucide.LucideIcon>)[ejercicio.icono] ?? Lucide.Dumbbell;

  return (
    <Card
      className={cn(
        "transition duration-200",
        onClick && "cursor-pointer hover:border-primario hover:bg-hover",
        selected && "border-primario",
      )}
      onClick={onClick}
    >
      <CardContent className={cn("flex items-center gap-3 p-3", compacto && "p-2")}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primario/15 text-primario">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-texto">{ejercicio.nombre}</h3>
            <Badge variant="outline">{ejercicio.grupoMuscular}</Badge>
          </div>
          {!compacto && <p className="mt-1 line-clamp-2 text-sm text-secundario">{ejercicio.detalle}</p>}
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
