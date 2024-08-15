import { Webhook, type WebhookRequiredHeaders } from "svix";
import { UnknownError } from "../errors/UnknownError";
import { ClerkService } from "./ClerkService";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export interface ClerkServiceProps {
  config: {
    clerkWebhookVerifier: Webhook;
  };
}

export class ClerkServiceImpl implements ClerkService {
  constructor(private props: ClerkServiceProps) {
    if (!this.props.config.clerkWebhookVerifier) {
      throw new UnknownError({
        detail: "Missing Clerk Webhook Secret env variable",
      });
    }
  }

  verifyWebhookSignature(
    headers: WebhookRequiredHeaders,
    payload: string | null,
  ): any {
    if (
      !headers["svix-id"] ||
      !headers["svix-signature"] ||
      !headers["svix-timestamp"] ||
      !payload
    ) {
      throw new UnauthorizedError({
        detail: "Invalid signature or payload",
      });
    }

    const response = this.props.config.clerkWebhookVerifier.verify(
      payload,
      headers,
    );

    return response as any;
  }
}
