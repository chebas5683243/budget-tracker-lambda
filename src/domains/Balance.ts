export class Balance {
  expense: number;

  income: number;

  constructor(data?: Partial<Balance>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
