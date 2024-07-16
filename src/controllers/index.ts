import { settingsService } from "../services";
import { SettingsController } from "./SettingsController";

export const settingsController = new SettingsController({
  service: settingsService,
  config: {},
});
