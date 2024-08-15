import { Setting } from "../domains/Setting";

export interface SettingsRepository {
  findByUserId(userId: string): Promise<Setting>;
  update(setting: Setting): Promise<Setting>;
  create(setting: Setting): Promise<Setting>;
}
