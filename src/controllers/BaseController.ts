import * as lambda from "aws-lambda";
import { logger } from "../logging";
import { GlobalError } from "../errors/GlobalError";
import { UnknownError } from "../errors/UnknownError";
import { EventContext } from "../types/Event";

export const CORS_HEADERS = {
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
};

export interface APIOkOptions
  extends Pick<lambda.APIGatewayProxyResult, "headers" | "isBase64Encoded"> {
  body?: any;
  statusCode?: 200 | 201 | 202 | 204;
}

export interface BaseControllerProps {}

export abstract class BaseController {
  constructor(protected props: BaseControllerProps) {}

  public parseRequest(event: lambda.APIGatewayEvent): {
    body?: any;
    context: EventContext;
  } {
    const { authorizer } = event.requestContext;

    return {
      body: event.body ? JSON.parse(event.body) : undefined,
      context: {
        userId: authorizer?.userId,
      },
    };
  }

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
      headers: { ...CORS_HEADERS, ...opts?.headers },
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
        headers: { ...CORS_HEADERS, ...headers },
        ...error.getApiData(),
      };
    }

    logger.error("API", error);

    return {
      headers: { ...CORS_HEADERS, ...headers },
      ...new UnknownError({
        detail: error.stack,
      }).getApiData(),
    };
  }
}
