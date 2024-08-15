import * as lambda from "aws-lambda";
import { BadRequestError } from "../../src/errors/BadRequestError";
import { ConflictError } from "../../src/errors/ConflictError";
import {
  BaseController,
  BaseControllerProps,
} from "../../src/controllers/BaseController";
import { UnknownError } from "../../src/errors/UnknownError";
import { NotFoundError } from "../../src/errors/NotFoundError";
import { ForbiddenError } from "../../src/errors/ForbiddenError";
import { UnauthorizedError } from "../../src/errors/UnauthorizedError";

class BaseControllerStub extends BaseController {
  protected getUUID(): any {
    return "correlationId";
  }
}

describe("BaseController", () => {
  describe("apiOk", () => {
    it("should return 200", () => {
      // Prepare
      const controller = new BaseControllerStub(
        {} as unknown as BaseControllerProps,
      );

      // Execute
      const response = controller.apiOk({
        body: {
          foo: "bar",
        },
      });

      // Validate
      expect(response).toEqual({
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
        },
        statusCode: 200,
        body: '{"foo":"bar"}',
      });
    });

    it("should return 200 for a string opts.body argument", () => {
      // Prepare
      const controller = new BaseControllerStub(
        {} as unknown as BaseControllerProps,
      );

      // Execute
      const response = controller.apiOk({
        body: "some string",
      });

      // Validate
      expect(response).toEqual({
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
        },
        statusCode: 200,
        body: "some string",
      });
    });

    it("should return 200 for a empty opts.body argument", () => {
      // Prepare
      const controller = new BaseControllerStub(
        {} as unknown as BaseControllerProps,
      );

      // Execute
      const response = controller.apiOk({});

      // Validate
      expect(response).toEqual({
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
        },
        statusCode: 200,
        body: "",
      });
    });

    it("should return 200 for a empty opts argument", () => {
      // Prepare
      const controller = new BaseControllerStub(
        {} as unknown as BaseControllerProps,
      );

      // Execute
      const response = controller.apiOk();

      // Validate
      expect(response).toEqual({
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
        },
        statusCode: 200,
        body: "",
      });
    });

    it("should return 200 for a binary response", () => {
      // Prepare
      const controller = new BaseControllerStub(
        {} as unknown as BaseControllerProps,
      );

      // Execute
      const response = controller.apiOk({
        body: Buffer.from("foo").toString("base64"),
        isBase64Encoded: true,
        headers: {
          "Content-Type": "application/png",
        },
      });

      // Validate
      expect(response).toEqual({
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
          "Content-Type": "application/png",
        },
        isBase64Encoded: true,
        statusCode: 200,
        body: "Zm9v",
      });
    });

    it("should return custom http code", () => {
      const controller = new BaseControllerStub(
        {} as unknown as BaseControllerProps,
      );

      // Execute
      const response = controller.apiOk({
        body: "some string",
        statusCode: 204,
      });

      // Validate
      expect(response).toEqual({
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
        },
        statusCode: 204,
        body: "some string",
      });
    });
  });

  describe("apiError", () => {
    it("should return BadRequestError", () => {
      // Prepare
      const controller = new BaseControllerStub(
        {} as unknown as BaseControllerProps,
      );

      // Execute
      const response = controller.apiError(
        new BadRequestError({
          message: "error",
        }),
      );

      // Validate
      expect(response).toEqual({
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
        },
        statusCode: 400,
        body: '{"code":"0.1.0","message":"error"}',
      });
    });

    it("should return ConflictError", () => {
      // Prepare
      const controller = new BaseControllerStub(
        {} as unknown as BaseControllerProps,
      );

      // Execute
      const response = controller.apiError(
        new ConflictError({
          message: "error",
        }),
      );

      // Validate
      expect(response).toEqual({
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
        },
        statusCode: 409,
        body: '{"code":"0.2.0","message":"error"}',
      });
    });

    it("should return UnknownError", () => {
      // Prepare
      const controller = new BaseControllerStub(
        {} as unknown as BaseControllerProps,
      );

      // Execute
      const response = controller.apiError(
        new UnknownError({
          message: "error",
        }),
      );

      // Validate
      expect(response).toEqual({
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
        },
        statusCode: 500,
        body: '{"code":"0.3.0","message":"error"}',
      });
    });

    it("should return NotFoundError", () => {
      // Prepare
      const controller = new BaseControllerStub(
        {} as unknown as BaseControllerProps,
      );

      // Execute
      const response = controller.apiError(
        new NotFoundError({
          message: "error",
        }),
      );

      // Validate
      expect(response).toEqual({
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
        },
        statusCode: 404,
        body: '{"code":"0.4.0","message":"error"}',
      });
    });

    it("should return ForbiddenError", () => {
      // Prepare
      const controller = new BaseControllerStub(
        {} as unknown as BaseControllerProps,
      );

      // Execute
      const response = controller.apiError(
        new ForbiddenError({
          message: "error",
        }),
      );

      // Validate
      expect(response).toEqual({
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
        },
        statusCode: 403,
        body: '{"code":"0.5.0","message":"error"}',
      });
    });

    it("should return UnauthorizedError", () => {
      // Prepare
      const controller = new BaseControllerStub(
        {} as unknown as BaseControllerProps,
      );

      // Execute
      const response = controller.apiError(
        new UnauthorizedError({
          message: "error",
        }),
      );

      // Validate
      expect(response).toEqual({
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
        },
        statusCode: 401,
        body: '{"code":"0.6.0","message":"error"}',
      });
    });

    it("should return unknown error", () => {
      // Prepare
      const controller = new BaseControllerStub(
        {} as unknown as BaseControllerProps,
      );

      // Execute
      const response = controller.apiError(new Error("error"));

      // Validate
      expect(response).toEqual({
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
        },
        statusCode: 500,
        body: '{"code":"0.3.0","message":"Unknown error"}',
      });
    });
  });

  describe("parseRequest", () => {
    it("should parse API request made with no body", () => {
      // Prepare
      const controller = new BaseControllerStub({});

      // Execute
      const response = controller.parseRequest({
        httpMethod: "GET",
        requestContext: {
          authorizer: {
            userId: "userId",
          },
        },
      } as unknown as lambda.APIGatewayProxyEvent);

      // Validate
      expect(response).toEqual({
        context: { userId: "userId" },
      });
    });

    it("should parse API request made with body", () => {
      // Prepare
      const controller = new BaseControllerStub({});

      // Execute
      const response = controller.parseRequest({
        httpMethod: "GET",
        requestContext: {
          authorizer: {
            userId: "userId",
          },
        },
        body: JSON.stringify({ foo: "bar" }),
      } as unknown as lambda.APIGatewayProxyEvent);

      // Validate
      expect(response).toEqual({
        body: { foo: "bar" },
        context: { userId: "userId" },
      });
    });
  });
});

jest.mock("../../src/logging", () => ({
  logger: { info: jest.fn(), error: jest.fn() },
}));
