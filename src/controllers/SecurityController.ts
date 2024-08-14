import * as lambda from "aws-lambda";
import { BaseController, BaseControllerProps } from "./BaseController";
import { SecurityService } from "../services/SecurityService";
import { logger } from "../logging";

export interface SecurityControllerProps extends BaseControllerProps {
  securityService: SecurityService;
}

export class SecurityController extends BaseController {
  constructor(protected props: SecurityControllerProps) {
    super(props);
  }

  async authorizeApiCall(event: lambda.APIGatewayTokenAuthorizerEvent) {
    try {
      logger.info("authorizer", { ...event });

      const [authSchema, credentials] =
        event.authorizationToken?.split(" ") || [];

      if (!authSchema || !credentials) {
        throw new Error("Unauthorized");
      }

      const user =
        await this.props.securityService.authenticateUser(credentials);

      const response = user.getAPIGatewayAuthorizerResult(event.methodArn);

      return response;
    } catch (e: any) {
      logger.error(e.message);
      throw new Error("Unauthorized");
    }
  }
}
