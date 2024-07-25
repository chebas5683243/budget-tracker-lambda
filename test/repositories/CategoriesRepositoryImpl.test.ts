import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { CategoriesRepositoryImpl } from "../../src/repositories/CategoriesRepositoryImpl";
import { Category } from "../../src/domains/Category";
import { CategoryStatus, CategoryType } from "../../src/types/Category";

class CategoriesRepositoryImplStub extends CategoriesRepositoryImpl {
  public getTimestamp(): number {
    return 1678734965;
  }

  public getUUID(): any {
    return "randomId";
  }
}

describe("CategoriesRepository", () => {
  describe("create", () => {
    it("should create a category", async () => {
      // Arrange
      const dynamoDbClientMock = {
        send: jest.fn(() =>
          Promise.resolve({
            Attributes: {
              id: "randomId",
              icon: "icon",
              name: "name",
              status: "ACTIVE",
              type: "INCOME",
              userId: "userId",
              creationDate: 1678734965,
            },
          }),
        ),
      } as unknown as DynamoDBDocumentClient;

      const repository = new CategoriesRepositoryImplStub({
        dynamoDbClient: dynamoDbClientMock,
        config: {
          categoriesTable: "categoriesTable",
        },
      });

      // Act
      const response = await repository.create(
        new Category({
          icon: "icon",
          name: "name",
          status: CategoryStatus.ACTIVE,
          type: CategoryType.INCOME,
          user: {
            id: "userId",
          },
        }),
      );

      // Assert
      expect(dynamoDbClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Item: {
              id: "randomId",
              icon: "icon",
              name: "name",
              status: "ACTIVE",
              type: "INCOME",
              userId: "userId",
              creationDate: 1678734965,
            },
            TableName: "categoriesTable",
            ReturnValues: "ALL_NEW",
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
    it("should return all loans from user", async () => {
      // Arrange
      const dynamoDbClientMock = {
        send: jest.fn(() =>
          Promise.resolve({
            Items: [
              {
                id: "id-1",
                userId: "userId",
                icon: "icon-1",
                name: "name-1",
                status: "ACTIVE",
                type: "INCOME",
                creationDate: 1678734965,
                lastUpdateDate: 1678734965,
              },
              {
                id: "id-2",
                userId: "userId",
                icon: "icon-2",
                name: "name-2",
                status: "ACTIVE",
                type: "EXPENSE",
                creationDate: 1678734965,
                lastUpdateDate: 1678734965,
              },
            ],
          }),
        ),
      } as unknown as DynamoDBDocumentClient;

      const repository = new CategoriesRepositoryImplStub({
        dynamoDbClient: dynamoDbClientMock,
        config: {
          categoriesTable: "categoriesTable",
        },
      });

      // Act
      const response = await repository.findByUserId("userId");

      // Assert
      expect(dynamoDbClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            TableName: "categoriesTable",
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: { ":userId": "userId" },
          },
        }),
      );

      expect(response).toEqual([
        {
          id: "id-1",
          user: { id: "userId" },
          icon: "icon-1",
          name: "name-1",
          status: "ACTIVE",
          type: "INCOME",
          creationDate: 1678734965,
          lastUpdateDate: 1678734965,
        },
        {
          id: "id-2",
          user: { id: "userId" },
          icon: "icon-2",
          name: "name-2",
          status: "ACTIVE",
          type: "EXPENSE",
          creationDate: 1678734965,
          lastUpdateDate: 1678734965,
        },
      ]);
    });

    it("should return all loans with no status DELETED", async () => {
      // Arrange
      const dynamoDbClientMock = {
        send: jest.fn(() =>
          Promise.resolve({
            Items: [
              {
                id: "id-1",
                userId: "userId",
                icon: "icon-1",
                name: "name-1",
                status: "ACTIVE",
                type: "INCOME",
                creationDate: 1678734965,
                lastUpdateDate: 1678734965,
              },
              {
                id: "id-2",
                userId: "userId",
                icon: "icon-2",
                name: "name-2",
                status: "DELETED",
                type: "EXPENSE",
                creationDate: 1678734965,
                lastUpdateDate: 1678734965,
              },
            ],
          }),
        ),
      } as unknown as DynamoDBDocumentClient;

      const repository = new CategoriesRepositoryImplStub({
        dynamoDbClient: dynamoDbClientMock,
        config: {
          categoriesTable: "categoriesTable",
        },
      });

      // Act
      const response = await repository.findByUserId("userId");

      // Assert
      expect(dynamoDbClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            TableName: "categoriesTable",
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: { ":userId": "userId" },
          },
        }),
      );

      expect(response).toEqual([
        {
          id: "id-1",
          user: { id: "userId" },
          icon: "icon-1",
          name: "name-1",
          status: "ACTIVE",
          type: "INCOME",
          creationDate: 1678734965,
          lastUpdateDate: 1678734965,
        },
      ]);
    });
  });
});
