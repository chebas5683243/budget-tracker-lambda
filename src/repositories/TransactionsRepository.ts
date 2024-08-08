import { Transaction } from "../domains/Transaction";

export interface TransactionsRepository {
  create(transaction: Transaction): Promise<Transaction>;
  findByUserId(userId: string): Promise<Transaction[]>;
  findByPeriod(
    userId: string,
    startDate: number,
    endDate: number,
  ): Promise<Transaction[]>;
  update(category: Transaction): Promise<Transaction>;
  delete(category: Transaction): Promise<void>;
}
