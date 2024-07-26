import { Category } from "../domains/Category";

export interface CategoriesService {
  create(category: Category): Promise<Category>;
  findByUserId(category: Category): Promise<Category[]>;
  update(category: Category): Promise<Category>;
  delete(category: Category): Promise<void>;
}
