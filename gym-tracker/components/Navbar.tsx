"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, ClipboardList, Dumbbell, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/rutinas", label: "Rutinas", icon: ClipboardList },
  { href: "/ejercicios", label: "Ejercicios", icon: Dumbbell },
  { href: "/historial", label: "Historial", icon: BarChart2 },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-24 border-r border-borde bg-panel/95 p-3 backdrop-blur lg:flex lg:flex-col">
        <Link href="/" className="mb-6 flex h-14 items-center justify-center rounded-lg bg-primario text-lg font-black text-white">
          GT
        </Link>
        <nav className="flex flex-1 flex-col gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-14 items-center justify-center rounded-lg text-secundario transition duration-200 hover:bg-hover hover:text-texto",
                      active && "bg-primario text-white hover:bg-primario-hover",
                    )}
                    aria-label={item.label}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-borde bg-panel/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden">
        <div className="grid grid-cols-4 gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-xs font-medium text-secundario transition duration-200 hover:bg-hover hover:text-texto",
                  active && "bg-primario text-white hover:bg-primario-hover",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
