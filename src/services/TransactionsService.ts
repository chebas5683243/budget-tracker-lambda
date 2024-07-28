import { Transaction } from "../domains/Transaction";

export interface TransactionsService {
  create(transaction: Transaction): Promise<Transaction>;
  findByUserId(category: Transaction): Promise<Transaction[]>;
  update(category: Transaction): Promise<Transaction>;
  delete(category: Transaction): Promise<void>;
}
