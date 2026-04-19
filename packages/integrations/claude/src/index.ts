import { createMockClaude } from './mock';
import type { ClaudePort } from './port';

export type { ClaudePort, Insight, InsightKind } from './port';

// ADR-003: Zero API LLM em runtime no MVP. Apenas mock disponível.
export function claude(): ClaudePort {
  return createMockClaude();
}
