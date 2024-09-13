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

  static findByPeriod = z
    .object({
      user: z.strictObject({
        id: z.string(),
      }),
      startDate: z.number(),
      endDate: z.number(),
    })
    .refine((data) => data.endDate >= data.startDate, {
      message: "End date should be greater than start date",
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
      {
        message:
          "One of the following is required: amount, description, category or transactionDate",
      },
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
