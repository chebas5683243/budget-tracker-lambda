import { Balance } from "./Balance";

export class HistoryDataRecord {
  balance: Balance;

  year: number;

  month: number;

  day?: number;

  constructor(data?: Partial<HistoryDataRecord>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
