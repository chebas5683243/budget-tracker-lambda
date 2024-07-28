import { z } from "zod";
import { Currency, Language, Theme } from "../types/Setting";

export class SettingsValidator {
  static findByUserId = z.object({
    user: z.strictObject({
      id: z.string().min(1),
    }),
  });

  static update = z
    .object({
      user: z.strictObject({
        id: z.string(),
      }),
      currency: z.nativeEnum(Currency).optional(),
      language: z.nativeEnum(Language).optional(),
      themePreference: z.nativeEnum(Theme).optional(),
    })
    .refine((data) => data.currency || data.language || data.themePreference, {
      message:
        "One of the following is required: currency, language or themePreference",
    });
}

export type SettingsValidatorMethods = Exclude<
  keyof typeof SettingsValidator,
  "prototype"
>;
