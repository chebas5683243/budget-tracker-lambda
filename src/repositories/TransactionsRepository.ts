import { Transaction } from "../domains/Transaction";

export interface TransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
}
