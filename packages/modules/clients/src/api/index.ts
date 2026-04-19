import { createServerClient } from '@apse/shared-auth/server';
import {
  type Client,
  CreateClientInputSchema,
  ListClientsQuerySchema,
  UpdateClientInputSchema,
} from './contracts';

export * from './contracts';

type ClientRow = {
  id: string;
  org_id: string;
  kind: 'PF' | 'PJ';
  name: string;
  document: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
};

function rowToClient(row: ClientRow): Client {
  return {
    id: row.id,
    orgId: row.org_id,
    kind: row.kind,
    name: row.name,
    document: row.document,
    email: row.email,
    phone: row.phone,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listClients(rawQuery: unknown): Promise<Client[]> {
  const query = ListClientsQuerySchema.parse(rawQuery);
  const supabase = await createServerClient();
  let q = supabase
    .from('clients')
    .select('*')
    .eq('org_id', query.orgId)
    .in('status', query.status)
    .order('name', { ascending: true });

  if (query.search) {
    const needle = `%${query.search}%`;
    q = q.or(`name.ilike.${needle},document.ilike.${needle},email.ilike.${needle}`);
  }

  const { data, error } = await q;
  if (error) throw error;
  return (data as ClientRow[]).map(rowToClient);
}

export async function getClient(id: string): Promise<Client | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from('clients').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToClient(data as ClientRow);
}

export async function createClient(raw: unknown): Promise<Client> {
  const input = CreateClientInputSchema.parse(raw);
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('clients')
    .insert({
      org_id: input.orgId,
      kind: input.kind,
      name: input.name,
      document: input.document ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      notes: input.notes ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return rowToClient(data as ClientRow);
}

export async function updateClient(raw: unknown): Promise<Client> {
  const input = UpdateClientInputSchema.parse(raw);
  const supabase = await createServerClient();
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.email !== undefined) patch.email = input.email ?? null;
  if (input.phone !== undefined) patch.phone = input.phone ?? null;
  if (input.notes !== undefined) patch.notes = input.notes ?? null;
  if (input.status !== undefined) patch.status = input.status;

  const { data, error } = await supabase
    .from('clients')
    .update(patch)
    .eq('id', input.id)
    .select('*')
    .single();
  if (error) throw error;
  return rowToClient(data as ClientRow);
}

export async function archiveClient(id: string): Promise<Client> {
  return updateClient({ id, status: 'archived' });
}
