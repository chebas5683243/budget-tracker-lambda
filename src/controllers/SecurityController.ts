import * as lambda from "aws-lambda";
import { BaseController, BaseControllerProps } from "./BaseController";
import { logger } from "../logging";

export interface SecurityControllerProps extends BaseControllerProps {}

export class SecurityController extends BaseController {
  constructor(protected props: SecurityControllerProps) {
    super(props);
  }

  async authorizeApiCall(event: lambda.APIGatewayTokenAuthorizerEvent) {
    try {
      const [authSchema, credentials] =
        event.authorizationToken?.split(" ") || [];

      if (!authSchema || !credentials) {
        throw new Error("Unauthorized");
      }

      logger.info("methodArn", event.methodArn);

      return this.apiOk({
        statusCode: 200,
        body: "response",
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }
}
