import * as lambda from "aws-lambda";
import { logger } from "../logging";
import { NotFoundError } from "../errors/NotFoundError";

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

  public async handler(event: lambda.APIGatewayProxyEvent) {
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

      logger.info("Unknown event", {
        resource: event.resource,
      });

      return Promise.resolve(
        new NotFoundError({ message: "Resource not found" }).getApiData(),
      );
    }

    if (this.customHandler) {
      return this.customHandler(event);
    }

    logger.info("Unknown event", JSON.stringify(event));
    return Promise.resolve();
  }
}

export const dispatcher = new LambdaDispatcher();
