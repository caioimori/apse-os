import { z } from 'zod';

export const MoneySchema = z.object({
  cents: z.number().int(),
  currency: z.enum(['BRL', 'USD']).default('BRL'),
});

export type Money = z.infer<typeof MoneySchema>;

export function reais(amount: number, currency: Money['currency'] = 'BRL'): Money {
  return { cents: Math.round(amount * 100), currency };
}

export function toDecimal(m: Money): number {
  return m.cents / 100;
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`currency mismatch: ${a.currency} + ${b.currency}`);
  }
  return { cents: a.cents + b.cents, currency: a.currency };
}

export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`currency mismatch: ${a.currency} - ${b.currency}`);
  }
  return { cents: a.cents - b.cents, currency: a.currency };
}
