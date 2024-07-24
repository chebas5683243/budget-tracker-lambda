import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SettingsRepositoryImpl } from "../../src/repositories/SettingsRepositoryImpl";
import { Setting } from "../../src/domains/Setting";
import { Currency, Language, Theme } from "../../src/types/Setting";

describe("SettingsRepository", () => {
  describe("findByUserId", () => {
    it("should return settings for user id", async () => {
      // Arrange
      const dynamoClientMock = {
        send: jest.fn().mockResolvedValue({
          Item: {
            id: "id",
            currency: "currency",
            language: "language",
            themePreference: "themePreference",
            userId: "userId",
          },
        }),
      } as unknown as DynamoDBClient;

      const repository = new SettingsRepositoryImpl({
        dynamoDbClient: dynamoClientMock,
        config: {
          settingsTable: "settingsTable",
        },
      });

      // Act
      const response = await repository.findByUserId("userId");

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

  describe("update", () => {
    it("should update user settings", async () => {
      // Arrange
      const dynamoClientMock = {
        send: jest.fn().mockResolvedValue(undefined),
      } as unknown as DynamoDBClient;

      const settingsRepository = new SettingsRepositoryImpl({
        dynamoDbClient: dynamoClientMock,
        config: {
          settingsTable: "settingsTable",
        },
      });

      // Act
      await settingsRepository.update(
        new Setting({
          id: "id",
          currency: Currency.PEN,
          language: Language.SPANISH,
          themePreference: Theme.DARK,
          user: {
            id: "userId",
          },
        }),
      );

      // Assert
      expect(dynamoClientMock.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            TableName: "settingsTable",
            Key: { userId: "userId" },
            UpdateExpression:
              "SET #currency = :currency, #language = :language, #themePreference = :themePreference",
            ExpressionAttributeNames: {
              "#language": "language",
              "#currency": "currency",
              "#themePreference": "themePreference",
            },
            ExpressionAttributeValues: {
              ":currency": "PEN",
              ":language": "SPANISH",
              ":themePreference": "DARK",
            },
          },
        }),
      );
    });
  });
});
