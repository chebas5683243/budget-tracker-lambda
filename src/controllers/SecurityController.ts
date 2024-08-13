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
      const [authSchema, credentials] =
        event.authorizationToken?.split(" ") || [];

      if (!authSchema || !credentials) {
        throw new Error("Unauthorized");
      }

      const user =
        await this.props.securityService.authenticateUser(credentials);

      logger.info("user", { ...user });

      const response = user.getAPIGatewayAuthorizerResult(event.methodArn);
      logger.info("response", { ...response });

      return response;
    } catch (e: any) {
      return this.apiError(e);
    }
  }
}
