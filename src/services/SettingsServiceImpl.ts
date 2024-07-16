import { Setting } from "../domains/Setting";
import { User } from "../domains/User";
import { SettingsRepository } from "../repositories/SettingsRepository";
import { SettingsService } from "./SettingsService";

export interface SettingsServiceProps {
  settingsRepo: SettingsRepository;
}

export class SettingsServiceImpl implements SettingsService {
  constructor(private props: SettingsServiceProps) {}

  async findByUserId(user: User): Promise<Setting[]> {
    const settings = this.props.settingsRepo.findByUserId(user.id);
    return settings;
  }
}
