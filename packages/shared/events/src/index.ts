export type DomainEvent<TType extends string = string, TPayload = unknown> = {
  id: string;
  type: TType;
  orgId: string;
  payload: TPayload;
  occurredAt: string;
  version: number;
};

export type Handler<E extends DomainEvent> = (event: E) => Promise<void>;

type HandlerMap = Map<string, Set<Handler<DomainEvent>>>;

const handlers: HandlerMap = new Map();

export async function emit<E extends DomainEvent>(event: E): Promise<void> {
  const subs = handlers.get(event.type);
  if (!subs) return;
  await Promise.allSettled(
    Array.from(subs).map(async (h) => {
      try {
        await h(event);
      } catch (err) {
        console.error(`[events] handler failed for ${event.type}`, err);
      }
    }),
  );
}

export function on<E extends DomainEvent>(type: E['type'], handler: Handler<E>): () => void {
  if (!handlers.has(type)) handlers.set(type, new Set());
  const bucket = handlers.get(type);
  if (!bucket) throw new Error('unreachable');
  bucket.add(handler as Handler<DomainEvent>);
  return () => bucket.delete(handler as Handler<DomainEvent>);
}

export function clearHandlers(): void {
  handlers.clear();
}
