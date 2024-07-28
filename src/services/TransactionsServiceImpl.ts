import { Transaction } from "../domains/Transaction";
import { TransactionsRepository } from "../repositories/TransactionsRepository";
import { TransactionsService } from "./TransactionsService";

export interface TransactionsServiceProps {
  transactionsRepo: TransactionsRepository;
}

export class TransactionsServiceImpl implements TransactionsService {
  constructor(private props: TransactionsServiceProps) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const newTransaction =
      await this.props.transactionsRepo.create(transaction);
    return newTransaction;
  }

  async findByUserId(transaction: Transaction): Promise<Transaction[]> {
    const categories = await this.props.transactionsRepo.findByUserId(
      transaction.user?.id!,
    );
    return categories;
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const updateTransaction =
      await this.props.transactionsRepo.update(transaction);
    return updateTransaction;
  }

  async delete(transaction: Transaction): Promise<void> {
    await this.props.transactionsRepo.delete(transaction);
  }
}
