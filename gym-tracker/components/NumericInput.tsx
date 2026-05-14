"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface NumericInputProps {
  value: string | number;
  onChange: (value: string) => void;
  ariaLabel: string;
  suffix?: string;
  allowDecimal?: boolean;
  allowNegative?: boolean;
  className?: string;
}

const baseKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", ".", "-"];

function sanitizeValue(value: string, allowDecimal: boolean, allowNegative: boolean) {
  let next = value.replace(allowDecimal ? /[^0-9.,-]/g : /[^0-9-]/g, "");

  if (!allowNegative) {
    next = next.replace(/-/g, "");
  } else {
    next = next.replace(/(?!^)-/g, "");
  }

  if (!allowDecimal) {
    return next.replace(/[.,]/g, "");
  }

  const chars = next.split("");
  let hasSeparator = false;

  return chars
    .filter((char) => {
      if (char !== "." && char !== ",") return true;
      if (hasSeparator) return false;
      hasSeparator = true;
      return true;
    })
    .join("");
}

export function NumericInput({
  value,
  onChange,
  ariaLabel,
  suffix,
  allowDecimal = false,
  allowNegative = false,
  className,
}: NumericInputProps) {
  const [open, setOpen] = useState(false);
  const textValue = String(value ?? "");
  const displayValue = textValue.length > 0 ? textValue : "0";
  const keys = baseKeys.filter((key) => {
    if ((key === "," || key === ".") && !allowDecimal) return false;
    if (key === "-" && !allowNegative) return false;
    return true;
  });

  function commit(next: string) {
    onChange(sanitizeValue(next, allowDecimal, allowNegative));
  }

  function pressKey(key: string) {
    if (key === "-") {
      commit(textValue.startsWith("-") ? textValue.slice(1) : `-${textValue}`);
      return;
    }

    if ((key === "." || key === ",") && textValue === "") {
      commit(`0${key}`);
      return;
    }

    if (/^[0-9]$/.test(key) && textValue === "0") {
      commit(key);
      return;
    }

    commit(`${textValue}${key}`);
  }

  return (
    <div className="relative">
      <label className="relative hidden md:block">
        <input
          className={cn(
            "h-12 w-full rounded-lg border border-borde bg-panel px-3 text-sm outline-none focus:ring-2 focus:ring-ring",
            suffix && "pr-9",
            className,
          )}
          inputMode={allowDecimal ? "decimal" : "numeric"}
          type="text"
          value={textValue}
          onChange={(event) => commit(event.target.value)}
          aria-label={ariaLabel}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-secundario">
            {suffix}
          </span>
        )}
      </label>

      <button
        type="button"
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-lg border border-borde bg-panel px-3 text-left text-sm outline-none transition focus:ring-2 focus:ring-ring md:hidden",
          open && "border-primario",
          className,
        )}
        onClick={() => setOpen((current) => !current)}
        aria-label={ariaLabel}
      >
        <span>{displayValue}</span>
        {suffix && <span className="text-xs font-semibold text-secundario">{suffix}</span>}
      </button>

      {open && (
        <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg border border-borde bg-panel p-2 shadow-lg md:hidden">
          {keys.map((key) => (
            <button
              key={key}
              type="button"
              className="h-11 rounded-lg bg-fondo text-base font-semibold text-texto transition hover:bg-hover active:bg-primario"
              onClick={() => pressKey(key)}
            >
              {key}
            </button>
          ))}
          <button
            type="button"
            className="h-11 rounded-lg bg-fondo text-sm font-semibold text-texto transition hover:bg-hover active:bg-primario"
            onClick={() => commit(textValue.slice(0, -1))}
          >
            Del
          </button>
          <button
            type="button"
            className="h-11 rounded-lg bg-fondo text-sm font-semibold text-texto transition hover:bg-hover active:bg-primario"
            onClick={() => commit("")}
          >
            Clear
          </button>
          <button
            type="button"
            className="h-11 rounded-lg bg-primario text-sm font-semibold text-white transition hover:bg-primario-hover"
            onClick={() => setOpen(false)}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}
