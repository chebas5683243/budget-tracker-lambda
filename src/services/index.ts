import { settingsRepo } from "../repositories";
import { SettingsServiceImpl } from "./SettingsServiceImpl";

export const settingsService = new SettingsServiceImpl({
  settingsRepo,
});
