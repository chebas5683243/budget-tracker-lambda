import * as lambda from "aws-lambda";
import { Setting } from "../domains/Setting";
import { SettingsService } from "../services/SettingsService";
import { BaseController, BaseControllerProps } from "./BaseController";

export interface SettingsControllerProps extends BaseControllerProps {
  service: SettingsService;
  config: {
    userId: string;
  };
}

export class SettingsController extends BaseController {
  constructor(protected props: SettingsControllerProps) {
    super(props);
  }

  async getSettings() {
    try {
      const setting = Setting.instanceFor("findByUserId", {
        user: { id: this.props.config.userId },
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

  async update(event: lambda.APIGatewayEvent) {
    try {
      const { body } = this.parseRequest(event);

      const setting = Setting.instanceFor("update", {
        currency: body.currency,
        language: body.language,
        themePreference: body.themePreference,
        user: {
          id: this.props.config.userId,
        },
      });

      const response = await this.props.service.update(setting);
      return this.apiOk({
        statusCode: 200,
        body: response,
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }
}
