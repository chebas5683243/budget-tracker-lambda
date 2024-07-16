import { DEFAULT_USER_ID } from "../config";
import { User } from "../domains/User";
import { SettingsService } from "../services/SettingsService";
import { BaseController, BaseControllerProps } from "./BaseController";

export interface SettingsControllerProps extends BaseControllerProps {
  service: SettingsService;
  config: {};
}

export class SettingsController extends BaseController {
  constructor(protected props: SettingsControllerProps) {
    super(props);
  }

  async getSettings() {
    try {
      const user = new User({ id: DEFAULT_USER_ID });
      const settings = await this.props.service.findByUserId(user);

      return this.apiOk({
        statusCode: 200,
        body: settings,
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }
}
