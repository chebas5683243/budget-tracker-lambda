import { SettingsRepository } from "../../src/repositories/SettingsRepository";
import { SettingsServiceImpl } from "../../src/services/SettingsServiceImpl";
import { Setting } from "../../src/domains/Setting";

describe("SettingsService", () => {
  describe("findByUserId", () => {
    it("should return settings searched by userId", async () => {
      // Arrange
      const settingsRepoMock = {
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
      } as unknown as SettingsRepository;

      const service = new SettingsServiceImpl({
        settingsRepo: settingsRepoMock,
      });

      // Act
      const response = await service.findByUserId(
        new Setting({
          user: {
            id: "userId",
          },
        }),
      );

      // Assert
      expect(settingsRepoMock.findByUserId).toHaveBeenCalledWith("userId");

      expect(response).toEqual({
        id: "id",
        currency: "PEN",
        language: "SPANISH",
        themePreference: "DARK",
        user: {
          id: "userId",
        },
      });
    });
  });
});
