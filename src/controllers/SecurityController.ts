import { BaseController, BaseControllerProps } from "./BaseController";

export interface SecurityControllerProps extends BaseControllerProps {}

export class SecurityController extends BaseController {
  constructor(protected props: SecurityControllerProps) {
    super(props);
  }

  async getSettings() {
    try {
      return this.apiOk({
        statusCode: 200,
        body: "response",
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }
}
