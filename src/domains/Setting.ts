import { BadRequestError } from "../errors/BadRequestError";
import { Currency, Language, Theme } from "../types/Setting";
import {
  SettingsValidator,
  type SettingsValidatorMethods,
} from "../validators/SettingsValidator";
import { User } from "./User";

export class Setting {
  id: string;

  currency: Currency;

  language: Language;

  themePreference: Theme;

  user: Partial<User>;

  lastUpdateDate: number;

  constructor(data?: Partial<Setting>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  static instanceFor(
    instanceSchema: SettingsValidatorMethods,
    data?: Partial<Setting>,
  ) {
    const validation = SettingsValidator[instanceSchema].safeParse(data);

    if (!validation.success) {
      throw new BadRequestError({
        message: `InvalidSettingAttributes : ${JSON.stringify(validation.error.errors)}`,
      });
    }

    return new Setting(validation.data);
  }
}
