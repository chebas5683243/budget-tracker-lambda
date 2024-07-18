import { Setting } from "../domains/Setting";
import { SettingsRepository } from "../repositories/SettingsRepository";
import { SettingsService } from "./SettingsService";

export interface SettingsServiceProps {
  settingsRepo: SettingsRepository;
}

export class SettingsServiceImpl implements SettingsService {
  constructor(private props: SettingsServiceProps) {}

  async findByUserId(setting: Setting): Promise<Setting> {
    const settings = this.props.settingsRepo.findByUserId(setting.user.id);
    return settings;
  }
}
