import { Setting } from "../domains/Setting";

export class SettingsMapper {
  static unmarshalSettings(item: Record<string, any>): Setting {
    return item as any;
  }
}
