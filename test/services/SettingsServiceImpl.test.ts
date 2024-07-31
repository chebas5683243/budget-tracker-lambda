import { SettingsRepository } from "../../src/repositories/SettingsRepository";
import { SettingsServiceImpl } from "../../src/services/SettingsServiceImpl";
import { Setting } from "../../src/domains/Setting";
import { Currency, Language, Theme } from "../../src/types/Setting";

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

  describe("update", () => {
    it("should update user settings", async () => {
      // Arrange
      const settingsRepoMock = {
        update: jest.fn(() =>
          Promise.resolve({
            id: "id",
            lastUpdateDate: 1678734965000,
          }),
        ),
      } as unknown as SettingsRepository;

      const service = new SettingsServiceImpl({
        settingsRepo: settingsRepoMock,
      });

      // Act
      const response = await service.update(
        new Setting({
          user: { id: "userId" },
          language: Language.SPANISH,
          currency: Currency.PEN,
          themePreference: Theme.DARK,
        }),
      );

      // Arrange
      expect(settingsRepoMock.update).toHaveBeenCalledWith({
        user: {
          id: "userId",
        },
        language: "SPANISH",
        currency: "PEN",
        themePreference: "DARK",
      });

      expect(response).toEqual({
        id: "id",
        lastUpdateDate: 1678734965000,
      });
    });
  });
});
