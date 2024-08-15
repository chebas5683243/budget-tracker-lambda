import { z } from "zod";
import { ClerkEventType } from "../types/ClerkEvent";

export class ClerkEventValidator {
  static userCreated = z.object({
    data: z.object({
      id: z.string(),
    }),
    type: z.literal(ClerkEventType.USER_CREATED),
  });
}

export type ClerkEventValidatorMethods = Exclude<
  keyof typeof ClerkEventValidator,
  "prototype"
>;
