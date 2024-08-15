import * as lambda from "aws-lambda";
import { SettingsService } from "../services/SettingsService";
import { BaseController } from "./BaseController";
import { ClerkService } from "../services/ClerkService";
import { ClerkEvent } from "../domains/ClerkEvent";
import { ClerkEventType } from "../types/ClerkEvent";

export interface ClerkControllerProps {
  settingsService: SettingsService;
  clerkService: ClerkService;
}

export class ClerkController extends BaseController {
  constructor(protected props: ClerkControllerProps) {
    super(props);
  }

  private verifyWebhookSignature(
    headers: lambda.APIGatewayProxyEventHeaders,
    payload: string | null,
  ) {
    return this.props.clerkService.verifyWebhookSignature(
      {
        "svix-id": headers["svix-id"]!,
        "svix-signature": headers["svix-signature"]!,
        "svix-timestamp": headers["svix-timestamp"]!,
      },
      payload,
    );
  }

  async processClerkWebhook(event: lambda.APIGatewayEvent) {
    try {
      const body = this.verifyWebhookSignature(event.headers, event.body);

      switch (body.type) {
        case ClerkEventType.USER_CREATED: {
          const clerkEvent = ClerkEvent.instanceFor("userCreated", {
            data: body.data,
            type: body.type,
          });

          await this.props.settingsService.createDefaultSettings(
            clerkEvent.data.id,
          );

          break;
        }
        default: {
          break;
        }
      }

      return this.apiOk({
        statusCode: 200,
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }
}
