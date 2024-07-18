import { randomUUID } from "crypto";
import * as lambda from "aws-lambda";
import { logger } from "../logging";
import { GlobalError } from "../errors/GlobalError";
import { UnknownError } from "../errors/UnknownError";
import { ForbiddenError } from "../errors/ForbiddenError";

export interface APIOkOptions
  extends Pick<lambda.APIGatewayProxyResult, "headers" | "isBase64Encoded"> {
  body?: any;
  statusCode?: 200 | 201 | 202 | 204;
}

export interface BaseControllerProps {}

export abstract class BaseController {
  constructor(protected props: BaseControllerProps) {}

  public apiOk(opts?: APIOkOptions): lambda.APIGatewayProxyResult {
    let body: string;

    if (typeof opts?.body === "string") {
      body = opts.body;
    } else {
      body = opts?.body ? JSON.stringify(opts.body) : "";
    }

    return {
      statusCode: opts?.statusCode || 200,
      isBase64Encoded: opts?.isBase64Encoded,
      headers: { ...opts?.headers },
      body,
    };
  }

  public apiError(
    error: Error,
    headers?: { [key: string]: string },
  ): lambda.APIGatewayProxyResult {
    if (error instanceof GlobalError) {
      logger.error("API", { error, detail: error.detail });
      return {
        headers: { ...headers },
        ...error.getApiData(),
      };
    }

    logger.error("API", error);

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
