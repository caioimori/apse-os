import { cn } from '../lib/cn';

type StatusVariant = 'paid' | 'pending' | 'overdue' | 'draft';

const styles: Record<StatusVariant, { bg: string; fg: string; label: string }> = {
  paid: {
    bg: 'bg-[var(--accent-repost-soft)]',
    fg: 'text-[var(--accent-repost)]',
    label: 'Pago',
  },
  pending: {
    bg: 'bg-[var(--accent-info-soft)]',
    fg: 'text-[var(--accent-info)]',
    label: 'Pendente',
  },
  overdue: {
    bg: 'bg-[var(--accent-like-soft)]',
    fg: 'text-[var(--accent-like)]',
    label: 'Vencido',
  },
  draft: {
    bg: 'bg-[var(--surface-default)]',
    fg: 'text-[var(--text-secondary)]',
    label: 'Rascunho',
  },
};

export function StatusPill({
  variant,
  className,
}: {
  variant: StatusVariant;
  className?: string;
}) {
  const s = styles[variant];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[var(--radius-badge)] px-2.5 py-0.5 text-xs font-medium',
        s.bg,
        s.fg,
        className,
      )}
    >
      {s.label}
    </span>
  );
}
