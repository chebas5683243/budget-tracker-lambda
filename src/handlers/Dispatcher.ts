import * as lambda from "aws-lambda";
import { logger } from "../logging";

export type Handler = (
  event: lambda.LambdaFunctionURLEvent,
) => Promise<lambda.LambdaFunctionURLResult>;

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export class LambdaDispatcher {
  private handlers: Map<string, Handler> = new Map();

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

  public async handler(
    event: lambda.LambdaFunctionURLEvent,
  ): Promise<lambda.LambdaFunctionURLResult> {
    const { http } = event.requestContext;

    const handler = this.handlers.get(`${http.method}:${http.path}`);

    logger.info(http.path, {
      extra: {
        httpMethod: http.method,
        queryStringParameters: event.queryStringParameters,
        body: event.body ? JSON.parse(event.body) : null,
      },
    });

    if (!handler) {
      logger.error("Dispatcher", new Error("No handler found"));
      return {
        statusCode: 404,
        body: "Not Found",
      };
    }

    return handler(event);
  }
}

export const dispatcher = new LambdaDispatcher();
