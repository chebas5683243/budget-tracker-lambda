import { randomUUID } from "crypto";
import * as lambda from "aws-lambda";
import { logger } from "../logging";
import { GlobalError } from "../errors/GlobalError";
import { UnknownError } from "../errors/UnknownError";
import { ForbiddenError } from "../errors/ForbiddenError";

export interface APIOkOptions
  extends Pick<lambda.APIGatewayProxyResult, "headers" | "isBase64Encoded"> {
  body?: any;
}

export interface MicroserviceControllerProps {}

export abstract class MicroserviceController {
  constructor(protected props: MicroserviceControllerProps) {}

  public apiOk(opts?: APIOkOptions): lambda.APIGatewayProxyResult {
    let body: string;

    if (typeof opts?.body === "string") {
      body = opts.body;
    } else {
      body = opts?.body ? JSON.stringify(opts.body) : "";
    }

    return {
      statusCode: 200,
      isBase64Encoded: opts?.isBase64Encoded,
      headers: { ...opts?.headers },
      body,
    };
  }

  public apiError(
    error: Error,
    headers?: { [key: string]: string },
  ): lambda.APIGatewayProxyResult {
    logger.error("API", error);

    if (error instanceof GlobalError) {
      return {
        headers: { ...headers },
        ...error.getApiData(),
      };
    }

    return {
      headers: { ...headers },
      ...new UnknownError({
        detail: error.stack,
      }).getApiData(),
    };
  }

  validateApiSecurity(event: lambda.APIGatewayEvent): void {
    if (event) return;
    throw new ForbiddenError();
  }

  protected getUUID(): string {
    return randomUUID();
  }
}
