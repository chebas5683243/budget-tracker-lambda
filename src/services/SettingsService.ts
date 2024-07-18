import { Setting } from "../domains/Setting";

export interface SettingsService {
  findByUserId(setting: Setting): Promise<Setting[]>;
}
