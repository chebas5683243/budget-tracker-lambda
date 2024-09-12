import { Category } from "../domains/Category";
import { Transaction } from "../domains/Transaction";
import { BadRequestError } from "../errors/BadRequestError";
import { CategoriesRepository } from "../repositories/CategoriesRepository";
import { TransactionsRepository } from "../repositories/TransactionsRepository";
import { CategoryStatus } from "../types/Category";
import { TransactionsService } from "./TransactionsService";

export interface TransactionsServiceProps {
  transactionsRepo: TransactionsRepository;
  categoriesRepo: CategoriesRepository;
}

export class TransactionsServiceImpl implements TransactionsService {
  constructor(private props: TransactionsServiceProps) {}

  async create(transaction: Transaction): Promise<Transaction> {
    await this.validateCategory(transaction);

    const newTransaction =
      await this.props.transactionsRepo.create(transaction);

    return newTransaction;
  }

  async findByUserId(transaction: Transaction): Promise<Transaction[]> {
    const [transactions, categories] = await Promise.all([
      this.props.transactionsRepo.findByUserId(transaction.user?.id!),
      this.props.categoriesRepo.findByUserId(transaction.user?.id!),
    ]);

    const categoriesMap = new Map(
      categories.map((category) => [category.id, category]),
    );

    transactions.forEach((txn) => {
      const category = categoriesMap.get(txn.category.id!)!;
      txn.category = new Category({
        id: category.id,
        name: category.name,
        icon: category.icon,
        type: category.type,
      });
    });

    return transactions;
  }

  async update(transaction: Transaction): Promise<Transaction> {
    if (transaction.category) {
      await this.validateCategory(transaction);
    }

    const updateTransaction =
      await this.props.transactionsRepo.update(transaction);

    return updateTransaction;
  }

  async delete(transaction: Transaction): Promise<void> {
    await this.props.transactionsRepo.delete(transaction);
  }

  private async validateCategory(transaction: Transaction) {
    const category = await this.props.categoriesRepo.findById(
      transaction.category.id!,
      transaction.user.id!,
    );

    if (category.status === CategoryStatus.DELETED) {
      throw new BadRequestError({ message: "Category doesn't exist" });
    }
  }
}
