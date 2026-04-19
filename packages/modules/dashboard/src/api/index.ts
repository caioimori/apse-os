import { listInvoices } from '@apse/modules-billing/api';
import { listClients } from '@apse/modules-clients/api';
import { getContract, listContracts } from '@apse/modules-contracts/api';
import { calculateMargin } from '@apse/shared-domain';

export type OrgOverview = {
  mrrCents: number;
  monthlyCostsCents: number;
  monthlyNetCents: number;
  avgMarginPct: number;
  activeContracts: number;
  activeClients: number;
  paidThisMonthCents: number;
  pendingCents: number;
  overdueCount: number;
  topClients: Array<{ clientId: string; clientName: string; monthlyCents: number }>;
  clientsAtRisk: Array<{ clientId: string; clientName: string; marginPct: number }>;
};

const RISK_MARGIN_PCT = 10;

export async function getOrgOverview(orgId: string): Promise<OrgOverview> {
  const [clients, contracts, invoices] = await Promise.all([
    listClients({ orgId, status: ['active', 'inactive'] }),
    listContracts(orgId),
    listInvoices(orgId),
  ]);

  const clientById = new Map(clients.map((c) => [c.id, c.name]));
  const activeContracts = contracts.filter((c) => c.status === 'active');

  // MRR + costs per contract
  let mrrCents = 0;
  let costsCents = 0;
  const perClient = new Map<string, number>();
  const clientMargins = new Map<string, number[]>();

  for (const c of activeContracts) {
    mrrCents += c.monthlyValueCents;
    perClient.set(c.clientId, (perClient.get(c.clientId) ?? 0) + c.monthlyValueCents);

    const full = await getContract(c.id);
    if (!full) continue;
    const margin = calculateMargin(
      c.monthlyValueCents,
      full.splits.map((s) => ({
        kind: s.kind,
        label: s.label,
        pct: s.pct,
        amountCents: s.amountCents,
      })),
    );
    costsCents += margin.totalCostCents;
    const arr = clientMargins.get(c.clientId) ?? [];
    arr.push(margin.marginPct);
    clientMargins.set(c.clientId, arr);
  }

  const netCents = mrrCents - costsCents;
  const avgMarginPct = mrrCents === 0 ? 0 : (netCents / mrrCents) * 100;

  // Invoices this month
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const paidThisMonthCents = invoices
    .filter((i) => i.status === 'paid' && i.paidAt && new Date(i.paidAt) >= monthStart)
    .reduce((a, b) => a + b.amountCents, 0);
  const pendingCents = invoices
    .filter((i) => i.status === 'pending')
    .reduce((a, b) => a + b.amountCents, 0);
  const overdueCount = invoices.filter((i) => i.status === 'overdue').length;

  const topClients = Array.from(perClient.entries())
    .map(([clientId, monthlyCents]) => ({
      clientId,
      clientName: clientById.get(clientId) ?? '—',
      monthlyCents,
    }))
    .sort((a, b) => b.monthlyCents - a.monthlyCents)
    .slice(0, 5);

  const clientsAtRisk: OrgOverview['clientsAtRisk'] = [];
  for (const [clientId, margins] of clientMargins) {
    const avg = margins.reduce((a, b) => a + b, 0) / margins.length;
    if (avg < RISK_MARGIN_PCT) {
      clientsAtRisk.push({
        clientId,
        clientName: clientById.get(clientId) ?? '—',
        marginPct: avg,
      });
    }
  }
  clientsAtRisk.sort((a, b) => a.marginPct - b.marginPct);

  return {
    mrrCents,
    monthlyCostsCents: costsCents,
    monthlyNetCents: netCents,
    avgMarginPct,
    activeContracts: activeContracts.length,
    activeClients: clients.length,
    paidThisMonthCents,
    pendingCents,
    overdueCount,
    topClients,
    clientsAtRisk,
  };
}
