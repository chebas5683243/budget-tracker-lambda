import { Setting } from "../domains/Setting";
import { SettingsRepository } from "../repositories/SettingsRepository";
import { Currency, Language, Theme } from "../types/Setting";
import { SettingsService } from "./SettingsService";

export interface SettingsServiceProps {
  settingsRepo: SettingsRepository;
}

export class SettingsServiceImpl implements SettingsService {
  constructor(private props: SettingsServiceProps) {}

  async findByUserId(setting: Setting): Promise<Setting> {
    const settings = this.props.settingsRepo.findByUserId(setting.user?.id!);
    return settings;
  }

  async update(setting: Setting): Promise<Setting> {
    const response = await this.props.settingsRepo.update(setting);
    return response;
  }

  async createDefaultSettings(userId: string): Promise<Setting> {
    const response = await this.props.settingsRepo.create(
      new Setting({
        currency: Currency.USD,
        language: Language.ENGLISH,
        themePreference: Theme.DEFAULT,
        user: {
          id: userId,
        },
      }),
    );
    return response;
  }
}
