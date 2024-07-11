import { Setting } from "../domains/Setting";

export interface SettingsService {
  getSettings(): Promise<Setting>;
}
