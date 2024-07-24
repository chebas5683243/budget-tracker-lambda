import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SettingsRepositoryImpl } from "../../src/repositories/SettingsRepositoryImpl";
import { Setting } from "../../src/domains/Setting";
import { Currency, Language, Theme } from "../../src/types/Setting";

class SettingsRepositoryImplStub extends SettingsRepositoryImpl {
  public getTimestamp(): number {
    return 1678734965;
  }

  public getUUID(): any {
    return "randomId";
  }
}

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
            lastUpdateDate: 1678734970,
          },
        }),
      } as unknown as DynamoDBClient;

      const repository = new SettingsRepositoryImplStub({
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
        lastUpdateDate: 1678734970,
      });
    });
  });

  describe("update", () => {
    it("should update user settings", async () => {
      // Arrange
      const dynamoClientMock = {
        send: jest.fn(() => Promise.resolve({})),
      } as unknown as DynamoDBClient;

      const settingsRepository = new SettingsRepositoryImplStub({
        dynamoDbClient: dynamoClientMock,
        config: {
          settingsTable: "settingsTable",
        },
      });

      // Act
      const response = await settingsRepository.update(
        new Setting({
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
              "SET #currency = :currency, #language = :language, #themePreference = :themePreference, #lastUpdateDate = :lastUpdateDate",
            ExpressionAttributeNames: {
              "#language": "language",
              "#currency": "currency",
              "#themePreference": "themePreference",
              "#lastUpdateDate": "lastUpdateDate",
            },
            ExpressionAttributeValues: {
              ":currency": "PEN",
              ":language": "SPANISH",
              ":themePreference": "DARK",
              ":lastUpdateDate": 1678734965,
            },
          },
        }),
      );

      expect(response).toEqual({
        lastUpdateDate: 1678734965,
      });
    });
  });
});
