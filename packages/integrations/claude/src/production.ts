// ADR-003 NON-NEGOTIABLE: Claude API production está BLOQUEADO no MVP.
// Reavaliar apenas ao atingir R$ 10k MRR, com cliente pagando por feature AI,
// ou se free tier viável (Groq/Gemini) atender o caso de uso.
// Qualquer implementação aqui viola a constituição — mantém stub que throw.

export function createProductionClaude(): never {
  throw new Error(
    'Claude production adapter bloqueado no MVP (ADR-003). Use APSE_CLAUDE_MODE=mock.',
  );
}
