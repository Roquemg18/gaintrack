"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Ejercicio, RegistroDia } from "@/lib/types";
import { fechaCorta } from "@/lib/utils";

interface GraficoProgresoProps {
  registros: RegistroDia[];
  ejercicio?: Ejercicio;
}

export function GraficoProgreso({ registros, ejercicio }: GraficoProgresoProps) {
  const data = registros
    .filter((registro) => !ejercicio || registro.ejercicioId === ejercicio.id)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .map((registro) => ({
      fecha: fechaCorta(registro.fecha),
      pesoMax: Math.max(...registro.series.map((serie) => serie.peso), 0),
      volumen: registro.series.reduce((total, serie) => total + serie.peso * serie.reps, 0),
    }));

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-borde text-sm text-secundario">
        Todavía no hay datos para graficar.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
          <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
          <XAxis dataKey="fecha" stroke="#9ca3af" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} fontSize={12} width={34} />
          <Tooltip
            contentStyle={{
              background: "#111827",
              border: "1px solid #1f2937",
              borderRadius: 8,
              color: "#f9fafb",
            }}
          />
          <Line
            type="monotone"
            dataKey="pesoMax"
            name="Peso máx."
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 3, fill: "#2563eb" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
