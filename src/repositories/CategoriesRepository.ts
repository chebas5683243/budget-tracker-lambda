import { Category } from "../domains/Category";

export interface CategoriesRepository {
  create(category: Category): Promise<Category>;
}
