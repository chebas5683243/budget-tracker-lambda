import * as lambda from "aws-lambda";
import { LambdaDispatcher } from "../../src/handlers/Dispatcher";
import { logger } from "../../src/logging";

describe("Dispatcher", () => {
  it("should execute a POST handler", async () => {
    // Arrange
    const dispatcher = new LambdaDispatcher();
    const handlerMock = jest.fn(() =>
      Promise.resolve({
        statusCode: 201,
        body: JSON.stringify({
          id: "id",
        }),
      }),
    );
    dispatcher.post("/resource/{resourceId}", handlerMock);

    // Act
    const response = await dispatcher.handler({
      httpMethod: "POST",
      resource: "/resource/{resourceId}",
      body: JSON.stringify({ test: "test" }),
      pathParameters: { resourceId: "resourceId" },
    } as unknown as lambda.APIGatewayEvent);

    // Assert
    expect(handlerMock).toHaveBeenCalledWith({
      httpMethod: "POST",
      resource: "/resource/{resourceId}",
      body: JSON.stringify({ test: "test" }),
      pathParameters: { resourceId: "resourceId" },
    });

    expect(response).toEqual({
      statusCode: 201,
      body: JSON.stringify({
        id: "id",
      }),
    });
  });

  it("should execute a GET handler", async () => {
    // Arrange
    const dispatcher = new LambdaDispatcher();
    const handlerMock = jest.fn(() =>
      Promise.resolve({
        statusCode: 200,
        body: JSON.stringify([
          {
            id: "id-1",
            name: "name-1",
          },
          {
            id: "id-2",
            name: "name-2",
          },
        ]),
      }),
    );
    dispatcher.get("/resource/{resourceId}", handlerMock);

    // Act
    const response = await dispatcher.handler({
      httpMethod: "GET",
      resource: "/resource/{resourceId}",
      pathParameters: { resourceId: "resourceId" },
      queryStringParameters: {
        query: "query",
      },
    } as unknown as lambda.APIGatewayEvent);

    // Assert
    expect(handlerMock).toHaveBeenCalledWith({
      httpMethod: "GET",
      resource: "/resource/{resourceId}",
      pathParameters: { resourceId: "resourceId" },
      queryStringParameters: {
        query: "query",
      },
    });

    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify([
        {
          id: "id-1",
          name: "name-1",
        },
        {
          id: "id-2",
          name: "name-2",
        },
      ]),
    });
  });

  it("should execute a PATCH handler", async () => {
    // Arrange
    const dispatcher = new LambdaDispatcher();
    const handlerMock = jest.fn(() =>
      Promise.resolve({
        statusCode: 200,
        body: JSON.stringify({
          id: "id",
        }),
      }),
    );
    dispatcher.patch("/resource/{resourceId}", handlerMock);

    // Act
    const response = await dispatcher.handler({
      httpMethod: "PATCH",
      resource: "/resource/{resourceId}",
      body: JSON.stringify({ test: "test" }),
      pathParameters: { resourceId: "resourceId" },
    } as unknown as lambda.APIGatewayEvent);

    // Assert
    expect(handlerMock).toHaveBeenCalledWith({
      httpMethod: "PATCH",
      resource: "/resource/{resourceId}",
      body: JSON.stringify({ test: "test" }),
      pathParameters: { resourceId: "resourceId" },
    });

    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        id: "id",
      }),
    });
  });

  it("should execute a PUT handler", async () => {
    // Arrange
    const dispatcher = new LambdaDispatcher();
    const handlerMock = jest.fn(() =>
      Promise.resolve({
        statusCode: 200,
        body: JSON.stringify({
          id: "id",
        }),
      }),
    );
    dispatcher.update("/resource/{resourceId}", handlerMock);

    // Act
    const response = await dispatcher.handler({
      httpMethod: "PUT",
      resource: "/resource/{resourceId}",
      body: JSON.stringify({ test: "test" }),
      pathParameters: { resourceId: "resourceId" },
    } as unknown as lambda.APIGatewayEvent);

    // Assert
    expect(handlerMock).toHaveBeenCalledWith({
      httpMethod: "PUT",
      resource: "/resource/{resourceId}",
      body: JSON.stringify({ test: "test" }),
      pathParameters: { resourceId: "resourceId" },
    });

    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        id: "id",
      }),
    });
  });

  it("should execute a DELETE handler", async () => {
    // Arrange
    const dispatcher = new LambdaDispatcher();
    const handlerMock = jest.fn(() =>
      Promise.resolve({
        statusCode: 204,
        body: "",
      }),
    );
    dispatcher.delete("/resource/{resourceId}", handlerMock);

    // Act
    const response = await dispatcher.handler({
      httpMethod: "DELETE",
      resource: "/resource/{resourceId}",
      pathParameters: { resourceId: "resourceId" },
    } as unknown as lambda.APIGatewayEvent);

    // Assert
    expect(handlerMock).toHaveBeenCalledWith({
      httpMethod: "DELETE",
      resource: "/resource/{resourceId}",
      pathParameters: { resourceId: "resourceId" },
    });

    expect(response).toEqual({
      statusCode: 204,
      body: "",
    });
  });

  it("should execute custom handler", async () => {
    // Arrange
    const dispatcher = new LambdaDispatcher();
    const handlerMock = jest.fn(() =>
      Promise.resolve({
        statusCode: 200,
        body: "custom handler",
      }),
    );
    dispatcher.custom(handlerMock);

    // Act
    const response = await dispatcher.handler({
      resource: "event",
    } as unknown as lambda.APIGatewayEvent);

    // Assert
    expect(handlerMock).toHaveBeenCalledWith({
      resource: "event",
    });

    expect(response).toEqual({
      statusCode: 200,
      body: "custom handler",
    });
  });

  it("should failed if no handler matches", async () => {
    // Arrange
    const dispatcher = new LambdaDispatcher();
    const handlerMock = jest.fn(() =>
      Promise.resolve({
        statusCode: 204,
        body: "",
      }),
    );
    dispatcher.delete("/another-resource", handlerMock);

    // Act
    const response = await dispatcher.handler({
      httpMethod: "DELETE",
      resource: "/resource/{resourceId}",
      pathParameters: { resourceId: "resourceId" },
    } as unknown as lambda.APIGatewayEvent);

    // Assert
    expect(handlerMock).not.toHaveBeenCalled();

    expect(response).toEqual({
      body: '{"code":"0.4.0","message":"Resource not found"}',
      statusCode: 404,
    });

    expect(logger.info).toHaveBeenCalledWith("Unknown event", {
      resource: "/resource/{resourceId}",
    });
  });
});

jest.mock("../../src/logging", () => ({
  logger: { info: jest.fn(), error: jest.fn() },
}));
