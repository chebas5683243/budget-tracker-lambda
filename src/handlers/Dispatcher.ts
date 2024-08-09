import * as lambda from "aws-lambda";
import { logger } from "../logging";

export type Handler = (
  event: lambda.APIGatewayProxyEvent,
) => Promise<lambda.APIGatewayProxyResult>;

export type CustomHandler<> = (event: any) => Promise<any>;

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  UPDATE = "PUT",
  DELETE = "DELETE",
}

export class LambdaDispatcher {
  private handlers: Map<string, Handler> = new Map();

  private customHandler: CustomHandler;

  public get(path: string, handler: Handler): void {
    this.handlers.set(`${HttpMethod.GET}:${path}`, handler);
  }

  public post(path: string, handler: Handler): void {
    this.handlers.set(`${HttpMethod.POST}:${path}`, handler);
  }

  public patch(path: string, handler: Handler): void {
    this.handlers.set(`${HttpMethod.PATCH}:${path}`, handler);
  }

  public update(path: string, handler: Handler): void {
    this.handlers.set(`${HttpMethod.UPDATE}:${path}`, handler);
  }

  public delete(path: string, handler: Handler): void {
    this.handlers.set(`${HttpMethod.DELETE}:${path}`, handler);
  }

  public custom(handler: CustomHandler) {
    this.customHandler = handler;
  }

  public async handler(
    event: lambda.APIGatewayProxyEvent,
  ): Promise<lambda.APIGatewayProxyResult> {
    logger.info("test", { ...event });
    if ("httpMethod" in event) {
      logger.info(event.resource, {
        httpMethod: event.httpMethod,
        body: event.body ? JSON.parse(event.body) : null,
        pathParameters: event.pathParameters,
        queryStringParameters: event.queryStringParameters,
      });

      const handler = this.handlers.get(
        `${event.httpMethod}:${event.resource}`,
      );

      if (handler) {
        return handler(event);
      }
    }

    if (this.customHandler) {
      return this.customHandler(event);
    }

    logger.error("Dispatcher", new Error("No handler found"));
    return {
      statusCode: 404,
      body: "Not Found",
    };
  }
}

export const dispatcher = new LambdaDispatcher();
