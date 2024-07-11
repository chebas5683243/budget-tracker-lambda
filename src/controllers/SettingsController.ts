import { BaseController, BaseControllerProps } from "./BaseController";

export interface SettingsControllerProps extends BaseControllerProps {
  service: any;
  config: {};
}

export const USER_UUID = "user_uuid";

export class SettingsController extends BaseController {
  constructor(protected props: SettingsControllerProps) {
    super(props);
  }

  async getSettings() {
    try {
      const settings = await this.props.service.getSettings();
      return this.apiOk({
        statusCode: 200,
        body: settings,
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }
}
