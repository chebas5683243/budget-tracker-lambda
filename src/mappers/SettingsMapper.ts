import { Setting } from "../domains/Setting";

export class SettingsMapper {
  static unmarshalSetting(item: Record<string, any>): Setting {
    return new Setting({
      id: item.id,
      user: { id: item.userId },
      currency: item.currency,
      language: item.language,
      themePreference: item.themePreference,
      lastUpdateDate: item.lastUpdateDate,
    });
  }
}
