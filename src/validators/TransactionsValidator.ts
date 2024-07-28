import { z } from "zod";

export class TransactionsValidator {
  static create = z.object({
    user: z.strictObject({
      id: z.string(),
    }),
    amount: z.number(),
    description: z.string().optional(),
    category: z.strictObject({
      id: z.string(),
    }),
    transactionDate: z.number(),
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
      amount: z.number().optional(),
      description: z.string().optional(),
      category: z
        .strictObject({
          id: z.string(),
        })
        .optional(),
      transactionDate: z.number().optional(),
    })
    .refine(
      (data) =>
        data.amount ||
        data.description ||
        data.category ||
        data.transactionDate,
    );

  static delete = z.object({
    id: z.string(),
    user: z.strictObject({
      id: z.string(),
    }),
  });
}

export type TransactionsValidatorMethods = Exclude<
  keyof typeof TransactionsValidator,
  "prototype"
>;
