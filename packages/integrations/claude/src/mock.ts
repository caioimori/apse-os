import type { ClaudePort, Insight, InsightKind } from './port';

const FIXTURES: Record<InsightKind, Insight[]> = {
  margin: [
    {
      kind: 'margin',
      headline: 'Margem média subiu 4pp em 30 dias',
      detail:
        'Reajustes em 2 contratos e redução de custos com ferramenta obsoleta explicam o delta.',
    },
    {
      kind: 'margin',
      headline: 'Contrato MindLoop tem margem 8% acima da média',
      detail: 'Benchmark pra negociar próximos splits com referência de mercado.',
    },
  ],
  risk: [
    {
      kind: 'risk',
      headline: 'Cliente X está no limiar (margem 7%)',
      detail: 'Considerar reajuste ou redução de custo. Fechar contrato abaixo de 10% drena caixa.',
    },
  ],
  growth: [
    {
      kind: 'growth',
      headline: 'Adicionar 1 cliente PJ ao nível atual eleva MRR em 18%',
      detail: 'Pipeline atual tem 3 leads qualificados que fechariam essa meta.',
    },
  ],
  anomaly: [
    {
      kind: 'anomaly',
      headline: 'Split "Figma" duplicado em 2 contratos',
      detail: 'Possível cobrança a maior. Validar se é intencional ou erro de cadastro.',
    },
  ],
};

export function createMockClaude(): ClaudePort {
  return {
    mode: 'mock',
    async generateInsights({ kind }) {
      await new Promise((r) => setTimeout(r, 120));
      if (kind) return FIXTURES[kind];
      return [FIXTURES.margin[0], FIXTURES.risk[0], FIXTURES.growth[0]].filter(
        (i): i is Insight => i != null,
      );
    },
  };
}
