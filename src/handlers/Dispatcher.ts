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

  public async dispatch(
    event: lambda.LambdaFunctionURLEvent,
  ): Promise<lambda.LambdaFunctionURLResult> {
    const { http } = event.requestContext;

    const handler = this.handlers.get(`${http.method}:${http.path}`);

    logger.info("Request information", {
      http,
      queryStringParameters: event.queryStringParameters,
      body: JSON.parse(event.body!),
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
