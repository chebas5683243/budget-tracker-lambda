import { CategorySummary } from "../domains/CategorySummary";
import { HistoryDataRecord } from "../domains/HistoryDataRecord";

export interface ReportsService {
  getTransactionsPeriods(userId: string): Promise<number[]>;
  getTransactionsSummaryInTimeframe(
    userId: string,
    params: { timeframe: "month" | "year"; year: number; month?: number },
  ): Promise<HistoryDataRecord[]>;
  getTransactionsSummaryByCategoryInPeriod(
    userId: string,
    params: { startDate: number; endDate: number },
  ): Promise<CategorySummary[]>;
}
