import { Setting } from "../domains/Setting";

export interface SettingsService {
  findByUserId(setting: Setting): Promise<Setting>;
  update(setting: Setting): Promise<Setting>;
  createDefaultSettings(userId: string): Promise<Setting>;
}
