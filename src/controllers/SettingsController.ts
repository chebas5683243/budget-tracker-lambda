import { DEFAULT_USER_ID } from "../config";
import { Setting } from "../domains/Setting";
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
      const setting = Setting.instanceFor("findByUserId", {
        user: { id: DEFAULT_USER_ID! },
      });
      const response = await this.props.service.findByUserId(setting);

      return this.apiOk({
        statusCode: 200,
        body: response,
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }
}
