import { Category } from "../domains/Category";

export interface CategoriesRepository {
  create(category: Category): Promise<Category>;
  findByUserId(userId: string): Promise<Category[]>;
  update(category: Category): Promise<Category>;
}
