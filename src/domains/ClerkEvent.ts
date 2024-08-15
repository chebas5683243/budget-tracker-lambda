import { BadRequestError } from "../errors/BadRequestError";
import { ClerkEventType } from "../types/ClerkEvent";
import {
  ClerkEventValidator,
  ClerkEventValidatorMethods,
} from "../validators/ClerkEventValidator";

export class ClerkEvent<T = any> {
  data: T;

  type: ClerkEventType;

  constructor(data?: Partial<ClerkEvent>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  static instanceFor(
    instanceSchema: ClerkEventValidatorMethods,
    data?: Partial<ClerkEvent>,
  ) {
    const validation = ClerkEventValidator[instanceSchema].safeParse(data);

    if (!validation.success) {
      throw new BadRequestError({
        message: `InvalidSettingAttributes : ${JSON.stringify(validation.error.errors)}`,
      });
    }

    return new ClerkEvent<typeof validation.data.data>(validation.data);
  }
}
