import { Category } from "./Category";

export class CategorySummary {
  category: Partial<Category>;

  _sum: {
    amount: number;
  };

  constructor(data?: Partial<CategorySummary>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
