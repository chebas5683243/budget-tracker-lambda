import { Transaction } from "../domains/Transaction";

export class TransactionsMapper {
  static marshalTransaction(transaction: Transaction): Record<string, any> {
    return {
      id: transaction.id,
      userId: transaction.user.id,
      categoryId: transaction.category.id,
      amount: transaction.amount,
      description: transaction.description,
      transactionDate: transaction.transactionDate,
      status: transaction.status,
      creationDate: transaction.creationDate,
      lastUpdateDate: transaction.lastUpdateDate,
    };
  }

  static unmarshalTransaction(item: Record<string, any>): Transaction {
    return new Transaction({
      id: item.id,
      user: { id: item.userId },
      category: { id: item.categoryId },
      amount: item.amount,
      description: item.description,
      transactionDate: item.transactionDate,
      status: item.status,
      creationDate: item.creationDate,
      lastUpdateDate: item.lastUpdateDate,
    });
  }
}
