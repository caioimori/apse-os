export type InsightKind = 'margin' | 'risk' | 'growth' | 'anomaly';

export type Insight = {
  kind: InsightKind;
  headline: string;
  detail: string;
};

export interface ClaudePort {
  mode: 'mock';
  generateInsights(input: { orgId: string; kind?: InsightKind }): Promise<Insight[]>;
}
