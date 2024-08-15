import { Setting } from "../domains/Setting";

export class SettingsMapper {
  static marshalSetting(setting: Setting): Record<string, any> {
    return {
      id: setting.id,
      userId: setting.user.id,
      currency: setting.currency,
      language: setting.language,
      themePreference: setting.themePreference,
      lastUpdateDate: setting.lastUpdateDate,
    };
  }

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
