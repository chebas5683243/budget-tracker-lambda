import { Setting } from "../domains/Setting";

export class SettingsMapper {
  static unmarshalSetting(item: Record<string, any>): Setting {
    return new Setting({
      id: item.id,
      name: item.name,
      user: { id: item.userId },
      value: item.value,
    });
  }
}
