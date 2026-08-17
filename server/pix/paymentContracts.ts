export type VerifiedPixWebhook = {
  providerEventId: string;
  providerChargeId: string;
  status: "confirmed" | "pending" | "rejected";
};

export type PixWebhookStore = {
  hasProcessed(eventId: string): Promise<boolean>;
  markProcessed(eventId: string): Promise<void>;
};

export async function acceptVerifiedPixWebhook(event: VerifiedPixWebhook, store: PixWebhookStore) {
  if (event.status !== "confirmed") return { accepted: false, reason: "not-confirmed" as const };
  if (await store.hasProcessed(event.providerEventId)) return { accepted: false, reason: "duplicate" as const };
  await store.markProcessed(event.providerEventId);
  return { accepted: true, chargeId: event.providerChargeId } as const;
}
