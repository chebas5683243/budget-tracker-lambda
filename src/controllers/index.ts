import { DEFAULT_USER_ID } from "../config";
import { settingsService } from "../services";
import { SettingsController } from "./SettingsController";

export const settingsController = new SettingsController({
  service: settingsService,
  config: {
    userId: DEFAULT_USER_ID!,
  },
});
