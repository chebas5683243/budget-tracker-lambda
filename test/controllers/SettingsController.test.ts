import * as lambda from "aws-lambda";
import { SettingsService } from "../../src/services/SettingsService";
import { SettingsController } from "../../src/controllers/SettingsController";

describe("SettingsController", () => {
  describe("getSettings", () => {
    it("should find settings by userId", async () => {
      // Arrange
      const settingsServiceMock = {
        findByUserId: jest.fn(() =>
          Promise.resolve({
            id: "id",
            currency: "PEN",
            language: "SPANISH",
            themePreference: "DARK",
            user: {
              id: "userId",
            },
          }),
        ),
      } as unknown as SettingsService;

      const controller = new SettingsController({
        service: settingsServiceMock,
        config: {
          userId: "userId",
        },
      });

      // Act
      const response = await controller.getSettings();

      // Assert
      expect(settingsServiceMock.findByUserId).toHaveBeenCalledWith({
        user: {
          id: "userId",
        },
      });

      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 200,
          body: JSON.stringify({
            id: "id",
            currency: "PEN",
            language: "SPANISH",
            themePreference: "DARK",
            user: {
              id: "userId",
            },
          }),
        }),
      );
    });
  });

  describe("update", () => {
    it("should update user settings", async () => {
      // Arrange
      const settingsServiceMock = {
        update: jest.fn(() =>
          Promise.resolve({
            id: "id",
            lastUpdateDone: 1678734965,
          }),
        ),
      } as unknown as SettingsService;

      const controller = new SettingsController({
        service: settingsServiceMock,
        config: {
          userId: "userId",
        },
      });

      // Act
      const response = await controller.update({
        httpMethod: "PATCH",
        body: JSON.stringify({
          language: "SPANISH",
          currency: "PEN",
          themePreference: "DARK",
        }),
      } as unknown as lambda.APIGatewayEvent);

      // Assert
      expect(settingsServiceMock.update).toHaveBeenCalledWith({
        language: "SPANISH",
        currency: "PEN",
        themePreference: "DARK",
        user: {
          id: "userId",
        },
      });

      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 200,
          body: JSON.stringify({
            id: "id",
            lastUpdateDone: 1678734965,
          }),
        }),
      );
    });
  });
});
