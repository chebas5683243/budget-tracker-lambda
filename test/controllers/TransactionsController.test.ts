import * as lambda from "aws-lambda";
import { TransactionsService } from "../../src/services/TransactionsService";
import { TransactionsController } from "../../src/controllers/TransactionsController";

describe("TransactionsController", () => {
  describe("create", () => {
    it("should create a new transaction", async () => {
      // Arrange
      process.env.DEFAULT_USER_ID = "userId";

      const transactionsServiceMock = {
        create: jest.fn(() =>
          Promise.resolve({
            id: "randomId",
            creationDate: 1678734965000,
          }),
        ),
      } as unknown as TransactionsService;

      const controller = new TransactionsController({
        transactionsService: transactionsServiceMock,
      });

      // Act
      const response = await controller.create({
        body: JSON.stringify({
          category: {
            id: "categoryId",
          },
          amount: 1000,
          description: "description",
          transactionDate: 1678730000000,
        }),
        requestContext: {
          authorizer: {
            userId: "userId",
          },
        },
      } as unknown as lambda.APIGatewayEvent);

      // Assert
      expect(transactionsServiceMock.create).toHaveBeenCalledWith({
        user: { id: "userId" },
        category: {
          id: "categoryId",
        },
        amount: 1000,
        description: "description",
        transactionDate: 1678730000000,
      });

      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 201,
          body: JSON.stringify({
            id: "randomId",
            creationDate: 1678734965000,
          }),
        }),
      );
    });
  });

  describe("findByUserId", () => {
    it("should return all user transactions", async () => {
      // Arrange
      const transactionsServiceMock = {
        findByPeriod: jest.fn(() =>
          Promise.resolve([
            {
              id: "id-1",
              user: { id: "userId" },
              icon: "icon-1",
              name: "name-1",
              status: "ACTIVE",
              type: "INCOME",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
            {
              id: "id-2",
              user: { id: "userId" },
              icon: "icon-2",
              name: "name-2",
              status: "ACTIVE",
              type: "EXPENSE",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
          ]),
        ),
      } as unknown as TransactionsService;

      const controller = new TransactionsController({
        transactionsService: transactionsServiceMock,
      });

      // Act
      const response = await controller.findByUserId({
        queryStringParameters: {
          startDate: "1678734965000",
          endDate: "1678734965001",
        },
        requestContext: {
          authorizer: {
            userId: "userId",
          },
        },
      } as unknown as lambda.APIGatewayEvent);

      // Assert
      expect(transactionsServiceMock.findByPeriod).toHaveBeenCalledWith({
        user: { id: "userId" },
        startDate: 1678734965000,
        endDate: 1678734965001,
      });

      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 200,
          body: JSON.stringify([
            {
              id: "id-1",
              user: { id: "userId" },
              icon: "icon-1",
              name: "name-1",
              status: "ACTIVE",
              type: "INCOME",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
            {
              id: "id-2",
              user: { id: "userId" },
              icon: "icon-2",
              name: "name-2",
              status: "ACTIVE",
              type: "EXPENSE",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
          ]),
        }),
      );
    });
  });

  describe("update", () => {
    it("should update transaction", async () => {
      // Arrange
      const transactionsServiceMock = {
        update: jest.fn(() =>
          Promise.resolve({
            id: "id",
            lastUpdateDate: 1678734965000,
          }),
        ),
      } as unknown as TransactionsService;

      const controller = new TransactionsController({
        transactionsService: transactionsServiceMock,
      });

      // Act
      const response = await controller.update({
        pathParameters: { transactionId: "id" },
        body: JSON.stringify({
          category: {
            id: "categoryId",
          },
          amount: 1000,
          description: "description",
          transactionDate: 1678730000000,
        }),
        requestContext: {
          authorizer: {
            userId: "userId",
          },
        },
      } as unknown as lambda.APIGatewayEvent);

      // Assert
      expect(transactionsServiceMock.update).toHaveBeenCalledWith({
        id: "id",
        user: { id: "userId" },
        category: {
          id: "categoryId",
        },
        amount: 1000,
        description: "description",
        transactionDate: 1678730000000,
      });

      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 200,
          body: JSON.stringify({
            id: "id",
            lastUpdateDate: 1678734965000,
          }),
        }),
      );
    });
  });

  describe("delete", () => {
    it("should delete transaction", async () => {
      // Arrange
      const transactionsServiceMock = {
        delete: jest.fn(() => Promise.resolve()),
      } as unknown as TransactionsService;

      const controller = new TransactionsController({
        transactionsService: transactionsServiceMock,
      });

      // Act
      const response = await controller.delete({
        pathParameters: { transactionId: "id" },
        requestContext: {
          authorizer: {
            userId: "userId",
          },
        },
      } as unknown as lambda.APIGatewayEvent);

      // Assert
      expect(transactionsServiceMock.delete).toHaveBeenCalledWith({
        id: "id",
        user: { id: "userId" },
      });

      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 204,
          body: "",
        }),
      );
    });
  });
});
