"use client";

import type { DiaDeSemana } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectorDiaProps {
  dias: DiaDeSemana[];
  value: string;
  onChange: (diaNombre: string) => void;
}

export function SelectorDia({ dias, value, onChange }: SelectorDiaProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Elegí un día" />
      </SelectTrigger>
      <SelectContent>
        {dias.map((dia) => (
          <SelectItem key={`${dia.dia}-${dia.nombre}`} value={dia.nombre}>
            {dia.dia} · {dia.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
