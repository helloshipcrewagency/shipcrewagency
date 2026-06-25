"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface MiniOption {
  value: string;
  label: string;
}

// Small pill dropdown matching the dashboard look: a button with a chevron and
// a popover menu whose selected row is highlighted. Closes on outside click.
export function MiniDropdown({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: string;
  options: MiniOption[];
  onChange: (v: string) => void;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="an-dd" ref={ref}>
      <button
        type="button"
        className="an-dd__btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{current?.label}</span>
        <ChevronDown size={15} className={open ? "an-dd__chev is-open" : "an-dd__chev"} />
      </button>
      {open && (
        <div className="an-dd__menu" role="listbox">
          {options.map((o) => (
            <button
              type="button"
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={`an-dd__item${o.value === value ? " is-active" : ""}`}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
