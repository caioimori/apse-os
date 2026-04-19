import type { CrmLead, CrmPort } from './port';

const FIXTURES: CrmLead[] = [
  {
    externalId: 'sonar_1',
    name: 'MindLoop Educação',
    kind: 'PJ',
    document: '33.444.555/0001-66',
    email: 'ops@mindloop.com.br',
    status: 'won',
    dealValueCents: 1500000,
  },
  {
    externalId: 'sonar_2',
    name: 'Estúdio Vertex',
    kind: 'PJ',
    document: '22.333.444/0001-55',
    email: 'contato@vertex.studio',
    status: 'won',
    dealValueCents: 800000,
  },
  {
    externalId: 'sonar_3',
    name: 'Lucas Fontes',
    kind: 'PF',
    document: '123.456.789-00',
    email: 'lucas@indie.dev',
    status: 'won',
    dealValueCents: 350000,
  },
  {
    externalId: 'sonar_4',
    name: 'Nebula Labs',
    kind: 'PJ',
    email: 'hello@nebula.ai',
    status: 'open',
    dealValueCents: 2000000,
  },
  {
    externalId: 'sonar_5',
    name: 'Açaí do Bairro',
    kind: 'PJ',
    email: 'gerente@acaidobairro.com',
    status: 'open',
    dealValueCents: 600000,
  },
];

export function createMockSonar(): CrmPort {
  return {
    provider: 'sonar',
    mode: 'mock',
    async listLeads() {
      return FIXTURES;
    },
    async listWon() {
      return FIXTURES.filter((l) => l.status === 'won');
    },
  };
}
