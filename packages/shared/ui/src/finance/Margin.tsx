import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { cn } from '../lib/cn';

type MarginProps = {
  percent: number;
  className?: string;
};

export function Margin({ percent, className }: MarginProps) {
  const sign = percent > 0 ? 'up' : percent < 0 ? 'down' : 'flat';
  const tone =
    sign === 'up'
      ? 'text-[var(--accent-repost)]'
      : sign === 'down'
        ? 'text-[var(--accent-like)]'
        : 'text-[var(--text-tertiary)]';
  const Icon = sign === 'up' ? ArrowUp : sign === 'down' ? ArrowDown : Minus;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-mono tabular-nums text-sm',
        tone,
        className,
      )}
    >
      <Icon size={14} strokeWidth={2.5} />
      {Math.abs(percent).toFixed(1)}%
    </span>
  );
}
