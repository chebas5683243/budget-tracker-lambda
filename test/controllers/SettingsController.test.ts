import { SettingsService } from "../../src/services/SettingsService";
import { SettingsController } from "../../src/controllers/SettingsController";

describe("SettingsController", () => {
  let OLD_ENV: NodeJS.ProcessEnv;

  beforeEach(() => {
    OLD_ENV = process.env;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

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
});
