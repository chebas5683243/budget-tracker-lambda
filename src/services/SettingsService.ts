import { Setting } from "../domains/Setting";
import { User } from "../domains/User";

export interface SettingsService {
  findByUserId(user: User): Promise<Setting[]>;
}
