import { createServerClient } from '@apse/shared-auth/server';
import {
  CreateOrgInputSchema,
  InviteMemberInputSchema,
  type Org,
  type OrgWithRole,
} from './contracts';

export * from './contracts';

export async function listMyOrgs(): Promise<OrgWithRole[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('members')
    .select('role, organizations!inner(id, name, slug, created_at)')
    .order('joined_at', { ascending: false, nullsFirst: false });

  if (error) throw error;
  const rows = data ?? [];

  return rows
    .map((row) => {
      const org = row.organizations as unknown as {
        id: string;
        name: string;
        slug: string;
        created_at: string;
      } | null;
      if (!org) return null;
      return {
        id: org.id,
        name: org.name,
        slug: org.slug,
        createdAt: org.created_at,
        role: row.role,
      } satisfies OrgWithRole;
    })
    .filter((o): o is OrgWithRole => o !== null);
}

export async function getOrg(id: string): Promise<Org | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('organizations')
    .select('id, name, slug, created_at')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    createdAt: data.created_at,
  };
}

export async function createOrg(raw: unknown): Promise<Org> {
  const input = CreateOrgInputSchema.parse(raw);
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('not authenticated');

  const { data: org, error } = await supabase
    .from('organizations')
    .insert({ name: input.name, slug: input.slug })
    .select('id, name, slug, created_at')
    .single();
  if (error) throw error;

  const { error: memberError } = await supabase.from('members').insert({
    org_id: org.id,
    user_id: user.id,
    role: 'owner',
    joined_at: new Date().toISOString(),
  });
  if (memberError) throw memberError;

  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    createdAt: org.created_at,
  };
}

export async function inviteMember(raw: unknown): Promise<{ status: 'mocked'; email: string }> {
  const input = InviteMemberInputSchema.parse(raw);
  // Email real implementa em Passo 11 (Resend). Por enquanto, no-op rastreável.
  console.warn(
    `[organizations] invite ${input.email} → org ${input.orgId} (role ${input.role}) — mock only`,
  );
  return { status: 'mocked', email: input.email };
}
