import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SettingsRepositoryImpl } from "../../src/repositories/SettingsRepositoryImpl";

describe("SettingsRepository", () => {
  describe("findByUserId", () => {
    it("should return settings for user id", async () => {
      // Arrange
      const dynamoClientMock = {
        send: jest.fn(() =>
          Promise.resolve({
            Item: {
              id: "id",
              currency: "currency",
              language: "language",
              themePreference: "themePreference",
              userId: "userId",
            },
          }),
        ),
      } as unknown as DynamoDBClient;

      const settingsRepository = new SettingsRepositoryImpl({
        dynamoDbClient: dynamoClientMock,
        config: {
          settingsTable: "settingsTable",
        },
      });

      // Act
      const response = await settingsRepository.findByUserId("userId");

      // Assert
      expect(dynamoClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            TableName: "settingsTable",
            Key: { userId: "userId" },
          },
        }),
      );

      expect(response).toEqual({
        id: "id",
        currency: "currency",
        language: "language",
        themePreference: "themePreference",
        user: {
          id: "userId",
        },
      });
    });
  });
});
