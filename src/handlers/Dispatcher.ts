import * as lambda from "aws-lambda";
import { logger } from "../logging";

export type Handler = (
  event: lambda.APIGatewayProxyEvent,
) => Promise<lambda.APIGatewayProxyResult>;

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
    event: lambda.APIGatewayProxyEvent,
  ): Promise<lambda.APIGatewayProxyResult> {
    logger.info(
      event.resource,
      JSON.stringify({
        httpMethod: event.httpMethod,
        body: event.body,
        pathParameters: event.pathParameters,
        queryStringParameters: event.queryStringParameters,
      }),
    );

    const handler = this.handlers.get(`${event.httpMethod}${event.resource}`);

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
