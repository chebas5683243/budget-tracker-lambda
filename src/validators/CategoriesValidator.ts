import { z } from "zod";
import { CategoryType } from "../types/Category";

export class CategoriesValidator {
  static create = z.object({
    user: z.strictObject({
      id: z.string(),
    }),
    name: z.string(),
    icon: z.string(),
    type: z.nativeEnum(CategoryType),
  });

  static findByUserId = z.object({
    user: z.strictObject({
      id: z.string(),
    }),
  });

  static update = z
    .object({
      id: z.string(),
      user: z.strictObject({
        id: z.string(),
      }),
      name: z.string().optional(),
      icon: z.string().optional(),
    })
    .refine((data) => data.name || data.icon);

  static delete = z.object({
    id: z.string(),
    user: z.strictObject({
      id: z.string(),
    }),
  });
}

export type CategoriesValidatorMethods = Exclude<
  keyof typeof CategoriesValidator,
  "prototype"
>;
