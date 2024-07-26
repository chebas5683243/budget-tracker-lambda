import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { CategoriesRepositoryImpl } from "../../src/repositories/CategoriesRepositoryImpl";
import { Category } from "../../src/domains/Category";
import { CategoryType } from "../../src/types/Category";

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
    it("should return all categories from user", async () => {
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

    it("should return all categories with no status DELETED", async () => {
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

  describe("update", () => {
    it("should update category", async () => {
      // Arrange
      const dynamoDbClientMock = {
        send: jest.fn(() =>
          Promise.resolve({
            Attributes: {
              id: "id",
              user: { id: "userId" },
              icon: "icon",
              name: "name",
              status: "ACTIVE",
              type: "INCOME",
              creationDate: 1678734965,
              lastUpdateDate: 1678734965,
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
      const response = await repository.update(
        new Category({
          id: "id",
          user: { id: "userId" },
          icon: "icon",
          name: "name",
        }),
      );

      // Assert
      expect(dynamoDbClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            TableName: "categoriesTable",
            Key: {
              userId: "userId",
              id: "id",
            },
            UpdateExpression:
              "SET #name = :name, #icon = :icon, #lastUpdateDate = :lastUpdateDate",
            ExpressionAttributeNames: {
              "#name": "name",
              "#icon": "icon",
              "#lastUpdateDate": "lastUpdateDate",
            },
            ExpressionAttributeValues: {
              ":name": "name",
              ":icon": "icon",
              ":lastUpdateDate": 1678734965,
            },
            ReturnValues: "ALL_NEW",
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
    it("should delete an existing category", async () => {
      // Arrange
      const dynamoDbClientMock = {
        send: jest.fn(() => Promise.resolve()),
      } as unknown as DynamoDBDocumentClient;

      const repository = new CategoriesRepositoryImplStub({
        dynamoDbClient: dynamoDbClientMock,
        config: {
          categoriesTable: "categoriesTable",
        },
      });

      // Act
      const response = await repository.delete(
        new Category({
          id: "id",
          user: { id: "userId" },
        }),
      );

      // Assert
      expect(dynamoDbClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            TableName: "categoriesTable",
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
          },
        }),
      );

      expect(response).toBeUndefined();
    });
  });
});
