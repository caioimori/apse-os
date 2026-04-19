// Feature flags in-process. Implementação completa em story futura.
const flags = new Map<string, boolean>();

export function setFlag(name: string, enabled: boolean): void {
  flags.set(name, enabled);
}

export function isEnabled(name: string): boolean {
  return flags.get(name) ?? false;
}
