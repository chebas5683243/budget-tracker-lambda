import { z } from "zod";
import { CategoryStatus, CategoryType } from "../types/Category";

export class CategoriesValidator {
  static create = z.object({
    id: z.string(),
    user: z.strictObject({
      id: z.string(),
    }),
    name: z.string(),
    icon: z.string(),
    type: z.nativeEnum(CategoryType),
    status: z.literal(CategoryStatus.ACTIVE),
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
      type: z.nativeEnum(CategoryType).optional(),
    })
    .refine((data) => data.name || data.icon || data.type);

  static delete = z.object({
    id: z.string(),
    user: z.strictObject({
      id: z.string(),
    }),
    status: z.literal(CategoryStatus.DELETED),
  });
}

export type CategoriesValidatorMethods = Exclude<
  keyof typeof CategoriesValidator,
  "prototype"
>;
