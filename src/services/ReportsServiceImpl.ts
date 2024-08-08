import { CategorySummary } from "../domains/CategorySummary";
import { HistoryDataRecord } from "../domains/HistoryDataRecord";
import { CategoriesRepository } from "../repositories/CategoriesRepository";
import { TransactionsRepository } from "../repositories/TransactionsRepository";
import { CategoryType } from "../types/Category";
import { ReportsService } from "./ReportsService";

export interface ReportsServiceProps {
  categoriesRepo: CategoriesRepository;
  transactionsRepo: TransactionsRepository;
}

export class ReportsServiceImpl implements ReportsService {
  constructor(private props: ReportsServiceProps) {}

  async getTransactionsPeriods(userId: string): Promise<number[]> {
    const transactions = await this.props.transactionsRepo.findByUserId(userId);

    const periods = transactions.reduce((periodsArr, item) => {
      const transactionYear = new Date(item.transactionDate).getUTCFullYear();
      if (periodsArr.includes(transactionYear)) return periodsArr;
      return [...periodsArr, transactionYear];
    }, [] as number[]);

    periods.sort((a, b) => a - b);

    return periods;
  }

  async getTransactionsSummaryInTimeframe(
    userId: string,
    params: { timeframe: "month" | "year"; year: number; month?: number },
  ): Promise<HistoryDataRecord[]> {
    const { timeframeSize, startDate, endDate, isYearTimeframe } =
      this.getTimeframeConfiguration(params);

    const [transactions, categories] = await Promise.all([
      this.props.transactionsRepo.findByPeriod(userId, startDate, endDate),
      this.props.categoriesRepo.findByUserId(userId),
    ]);

    const categoriesMap = new Map(
      categories.map((category) => [category.id, category]),
    );

    transactions.forEach((transaction) => {
      transaction.category = categoriesMap.get(transaction.category.id!)!;
    });

    const dataSummary = Array.from(
      { length: timeframeSize },
      (_, index) =>
        ({
          year: params.year,
          month: isYearTimeframe ? index : params.month!,
          balance: { expense: 0, income: 0 },
          ...(!isYearTimeframe && { day: index + 1 }),
        }) satisfies HistoryDataRecord,
    );

    transactions.forEach((transaction) => {
      const periodUnit = isYearTimeframe
        ? new Date(transaction.transactionDate).getUTCMonth()
        : new Date(transaction.transactionDate).getUTCDate() - 1;

      if (transaction.category.type === CategoryType.INCOME) {
        dataSummary[periodUnit].balance.income += transaction.amount;
      } else {
        dataSummary[periodUnit].balance.expense += transaction.amount;
      }
    });

    return dataSummary;
  }

  async getTransactionsSummaryByCategoryInPeriod(
    userId: string,
    params: { startDate: number; endDate: number },
  ): Promise<CategorySummary[]> {
    const [transactions, categories] = await Promise.all([
      this.props.transactionsRepo.findByPeriod(
        userId,
        params.startDate,
        params.endDate,
      ),
      this.props.categoriesRepo.findByUserId(userId),
    ]);

    const categoriesMap = new Map(
      categories.map((category) => [category.id, category]),
    );

    const categoriesSummary = new Map<string, CategorySummary>();

    transactions.forEach((transaction) => {
      const categoryId = transaction.category.id!;
      const categorySummary = categoriesSummary.get(categoryId);

      if (!categorySummary) {
        categoriesSummary.set(categoryId, {
          category: categoriesMap.get(categoryId)!,
          sum: { amount: transaction.amount },
        });
        return;
      }

      categoriesSummary.set(categoryId, {
        category: categorySummary.category,
        sum: { amount: transaction.amount + categorySummary.sum.amount },
      });
    });

    return Array.from(categoriesSummary.values()).sort(
      (cat1, cat2) => cat2.sum.amount - cat1.sum.amount,
    );
  }

  private getTimeframeConfiguration(params: {
    timeframe: "month" | "year";
    year: number;
    month?: number;
  }) {
    const isYearTimeframe = params.timeframe === "year";

    if (isYearTimeframe) {
      return {
        isYearTimeframe,
        startDate: Date.UTC(params.year),
        endDate: Date.UTC(params.year + 1) - 1,
        timeframeSize: 12,
      };
    }

    return {
      isYearTimeframe,
      startDate: Date.UTC(params.year, params.month!, 1),
      endDate: Date.UTC(params.year, params.month! + 1, 1) - 1,
      timeframeSize: new Date(
        Date.UTC(params.year, params.month! + 1, 0),
      ).getUTCDate(),
    };
  }
}
