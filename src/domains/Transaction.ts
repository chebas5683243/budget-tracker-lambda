import { BadRequestError } from "../errors/BadRequestError";
import { TransactionStatus } from "../types/Transaction";
import {
  TransactionsValidator,
  TransactionsValidatorMethods,
} from "../validators/TransactionsValidator";
import { Category } from "./Category";
import { User } from "./User";

export class Transaction {
  id: string;

  user: Partial<User>;

  category: Partial<Category>;

  amount: number;

  description?: string;

  transactionDate: number;

  status: TransactionStatus;

  creationDate: number;

  lastUpdateDate: number;

  startDate: number;

  endDate: number;

  constructor(data?: Partial<Transaction>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  static instanceFor(
    instanceSchema: TransactionsValidatorMethods,
    data?: Partial<Transaction>,
  ) {
    const validation = TransactionsValidator[instanceSchema].safeParse(data);

    if (!validation.success) {
      throw new BadRequestError({
        message: `InvalidSettingAttributes : ${JSON.stringify(validation.error.errors)}`,
      });
    }

    return new Transaction(validation.data);
  }
}
