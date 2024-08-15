import type { WebhookRequiredHeaders } from "svix";

export interface ClerkService {
  verifyWebhookSignature(
    headers: WebhookRequiredHeaders,
    payload: string | null,
  ): any;
}
