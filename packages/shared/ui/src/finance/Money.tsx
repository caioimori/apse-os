import { cn } from '../lib/cn';

type MoneySemantic = 'neutral' | 'profit' | 'loss';

type MoneyProps = {
  amount: number;
  currency?: 'BRL' | 'USD';
  semantic?: MoneySemantic;
  className?: string;
};

const formatters: Record<'BRL' | 'USD', Intl.NumberFormat> = {
  BRL: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
  USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
};

export function Money({ amount, currency = 'BRL', semantic = 'neutral', className }: MoneyProps) {
  const negative = amount < 0;
  const tone =
    semantic === 'profit' || (semantic === 'neutral' && amount > 0)
      ? 'text-[var(--accent-repost)]'
      : semantic === 'loss' || negative
        ? 'text-[var(--accent-like)]'
        : 'text-[var(--text-primary)]';

  return (
    <span className={cn('font-mono tabular-nums', tone, className)}>
      {formatters[currency].format(amount)}
    </span>
  );
}
