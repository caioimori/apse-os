import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

type KPIBlockProps = {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  className?: string;
};

export function KPIBlock({ label, value, delta, className }: KPIBlockProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-6 shadow-[var(--shadow-xs)]',
        className,
      )}
    >
      <span className="text-xs font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--text-secondary)]">
        {label}
      </span>
      <div className="font-mono text-3xl tabular-nums text-[var(--text-primary)]">{value}</div>
      {delta ? <div className="text-sm">{delta}</div> : null}
    </div>
  );
}
