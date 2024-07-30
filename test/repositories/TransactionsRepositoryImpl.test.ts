import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { TransactionsRepositoryImpl } from "../../src/repositories/TransactionsRepositoryImpl";
import { Transaction } from "../../src/domains/Transaction";

class TransactionsRepositoryImplStub extends TransactionsRepositoryImpl {
  public getTimestamp(): number {
    return 1678734965;
  }

  public getUUID(): any {
    return "randomId";
  }
}

describe("TransactionsRepository", () => {
  describe("create", () => {
    it("should create a transaction", async () => {
      // Arrange
      const dynamoDbClientMock = {
        send: jest.fn(() => Promise.resolve()),
      } as unknown as DynamoDBDocumentClient;

      const repository = new TransactionsRepositoryImplStub({
        dynamoDbClient: dynamoDbClientMock,
        config: {
          transactionsTable: "transactionsTable",
        },
      });

      // Act
      const response = await repository.create(
        new Transaction({
          user: {
            id: "userId",
          },
          category: {
            id: "categoryId",
          },
          amount: 1000,
          description: "description",
          transactionDate: 1678730000,
        }),
      );

      // Assert
      expect(dynamoDbClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Item: {
              id: "randomId",
              userId: "userId",
              categoryId: "categoryId",
              amount: 1000,
              description: "description",
              transactionDate: 1678730000,
              status: "ACTIVE",
              creationDate: 1678734965,
            },
            TableName: "transactionsTable",
            ConditionExpression: "attribute_not_exists(id)",
          },
        }),
      );

      expect(response).toEqual({
        id: "randomId",
        creationDate: 1678734965,
      });
    });
  });

  describe("findByUserId", () => {
    it("should return all transactions from user", async () => {
      // Arrange
      const dynamoDbClientMock = {
        send: jest.fn(() =>
          Promise.resolve({
            Items: [
              {
                id: "id-1",
                userId: "userId-1",
                categoryId: "categoryId-1",
                amount: 1000,
                description: "description-1",
                transactionDate: 1678730000,
                status: "ACTIVE",
                creationDate: 1678734965,
                lastUpdateDate: 1678734965,
              },
              {
                id: "id-2",
                userId: "userId-2",
                categoryId: "categoryId-2",
                amount: 1000,
                description: "description-2",
                transactionDate: 1678730000,
                status: "ACTIVE",
                creationDate: 1678734965,
                lastUpdateDate: 1678734965,
              },
            ],
          }),
        ),
      } as unknown as DynamoDBDocumentClient;

      const repository = new TransactionsRepositoryImplStub({
        dynamoDbClient: dynamoDbClientMock,
        config: {
          transactionsTable: "transactionsTable",
        },
      });

      // Act
      const response = await repository.findByUserId("userId");

      // Assert
      expect(dynamoDbClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            TableName: "transactionsTable",
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: { ":userId": "userId" },
          },
        }),
      );

      expect(response).toEqual([
        {
          id: "id-1",
          user: { id: "userId-1" },
          category: { id: "categoryId-1" },
          amount: 1000,
          description: "description-1",
          transactionDate: 1678730000,
          status: "ACTIVE",
          creationDate: 1678734965,
          lastUpdateDate: 1678734965,
        },
        {
          id: "id-2",
          user: { id: "userId-2" },
          category: { id: "categoryId-2" },
          amount: 1000,
          description: "description-2",
          transactionDate: 1678730000,
          status: "ACTIVE",
          creationDate: 1678734965,
          lastUpdateDate: 1678734965,
        },
      ]);
    });

    it("should return all transactions with no status DELETED", async () => {
      // Arrange
      const dynamoDbClientMock = {
        send: jest.fn(() =>
          Promise.resolve({
            Items: [
              {
                id: "id-1",
                userId: "userId-1",
                categoryId: "categoryId-1",
                amount: 1000,
                description: "description-1",
                transactionDate: 1678730000,
                status: "ACTIVE",
                creationDate: 1678734965,
                lastUpdateDate: 1678734965,
              },
              {
                id: "id-2",
                userId: "userId-2",
                categoryId: "categoryId-2",
                amount: 1000,
                description: "description-2",
                transactionDate: 1678730000,
                status: "DELETED",
                creationDate: 1678734965,
                lastUpdateDate: 1678734965,
              },
            ],
          }),
        ),
      } as unknown as DynamoDBDocumentClient;

      const repository = new TransactionsRepositoryImplStub({
        dynamoDbClient: dynamoDbClientMock,
        config: {
          transactionsTable: "transactionsTable",
        },
      });

      // Act
      const response = await repository.findByUserId("userId");

      // Assert
      expect(dynamoDbClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            TableName: "transactionsTable",
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: { ":userId": "userId" },
          },
        }),
      );

      expect(response).toEqual([
        {
          id: "id-1",
          user: { id: "userId-1" },
          category: { id: "categoryId-1" },
          amount: 1000,
          description: "description-1",
          transactionDate: 1678730000,
          status: "ACTIVE",
          creationDate: 1678734965,
          lastUpdateDate: 1678734965,
        },
      ]);
    });
  });

  describe("update", () => {
    it("should update transaction", async () => {
      // Arrange
      const dynamoDbClientMock = {
        send: jest.fn(() =>
          Promise.resolve({
            Attributes: {
              id: "id",
              userId: "userId",
              categoryId: "categoryId",
              amount: 1000,
              description: "description",
              transactionDate: 1678730000,
              status: "ACTIVE",
              creationDate: 1678734965,
              lastUpdateDate: 1678734965,
            },
          }),
        ),
      } as unknown as DynamoDBDocumentClient;

      const repository = new TransactionsRepositoryImplStub({
        dynamoDbClient: dynamoDbClientMock,
        config: {
          transactionsTable: "transactionsTable",
        },
      });

      // Act
      const response = await repository.update(
        new Transaction({
          id: "id",
          user: { id: "userId" },
          category: { id: "categoryId" },
          amount: 1000,
          description: "description",
          transactionDate: 1678730000,
        }),
      );

      // Assert
      expect(dynamoDbClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            TableName: "transactionsTable",
            Key: {
              userId: "userId",
              id: "id",
            },
            UpdateExpression:
              "SET #amount = :amount, #description = :description, #categoryId = :categoryId, #transactionDate = :transactionDate, #lastUpdateDate = :lastUpdateDate",
            ExpressionAttributeNames: {
              "#amount": "amount",
              "#description": "description",
              "#categoryId": "categoryId",
              "#transactionDate": "transactionDate",
              "#lastUpdateDate": "lastUpdateDate",
            },
            ExpressionAttributeValues: {
              ":amount": 1000,
              ":description": "description",
              ":categoryId": "categoryId",
              ":transactionDate": 1678730000,
              ":lastUpdateDate": 1678734965,
            },
            ReturnValues: "ALL_NEW",
            ConditionExpression: "attribute_exists(id) AND status = ACTIVE",
          },
        }),
      );

      expect(response).toEqual({
        id: "id",
        lastUpdateDate: 1678734965,
      });
    });
  });

  describe("delete", () => {
    it("should delete an existing transaction", async () => {
      // Arrange
      const dynamoDbClientMock = {
        send: jest.fn(() => Promise.resolve()),
      } as unknown as DynamoDBDocumentClient;

      const repository = new TransactionsRepositoryImplStub({
        dynamoDbClient: dynamoDbClientMock,
        config: {
          transactionsTable: "transactionsTable",
        },
      });

      // Act
      const response = await repository.delete(
        new Transaction({
          id: "id",
          user: { id: "userId" },
        }),
      );

      // Assert
      expect(dynamoDbClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            TableName: "transactionsTable",
            Key: {
              userId: "userId",
              id: "id",
            },
            UpdateExpression:
              "SET #status = :status, #lastUpdateDate = :lastUpdateDate",
            ExpressionAttributeNames: {
              "#status": "status",
              "#lastUpdateDate": "lastUpdateDate",
            },
            ExpressionAttributeValues: {
              ":status": "DELETED",
              ":lastUpdateDate": 1678734965,
            },
            ConditionExpression: "attribute_exists(id) AND status = ACTIVE",
          },
        }),
      );

      expect(response).toBeUndefined();
    });
  });
});
