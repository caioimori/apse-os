export type CrmLead = {
  externalId: string;
  name: string;
  kind: 'PF' | 'PJ';
  document?: string;
  email?: string;
  phone?: string;
  status?: string;
  dealValueCents?: number;
};

export interface CrmPort {
  provider: 'sonar' | 'pipedrive';
  mode: 'mock' | 'sandbox' | 'production';
  listLeads(): Promise<CrmLead[]>;
  listWon(): Promise<CrmLead[]>;
}
