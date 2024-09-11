import { Category } from "../domains/Category";
import { ConflictError } from "../errors/ConflictError";
import { CategoriesRepository } from "../repositories/CategoriesRepository";
import { TransactionsRepository } from "../repositories/TransactionsRepository";
import { CategoriesService } from "./CategoriesService";

export interface CategoriesServiceProps {
  categoriesRepo: CategoriesRepository;
  transactionsRepo: TransactionsRepository;
}

export class CategoriesServiceImpl implements CategoriesService {
  constructor(private props: CategoriesServiceProps) {}

  async create(category: Category): Promise<Category> {
    const newCategory = await this.props.categoriesRepo.create(category);
    return newCategory;
  }

  async findByUserId(category: Category): Promise<Category[]> {
    const categories = await this.props.categoriesRepo.findByUserId(
      category.user?.id!,
    );
    return categories;
  }

  async update(category: Category): Promise<Category> {
    const updateCategory = await this.props.categoriesRepo.update(category);
    return updateCategory;
  }

  async delete(category: Category): Promise<void> {
    const transactions = await this.props.transactionsRepo.findByCategoryId(
      category.user.id!,
      category.id,
    );

    if (transactions.length > 0) {
      throw new ConflictError({
        detail:
          "Category cannot be deleted because it is associated with active transactions.",
      });
    }

    await this.props.categoriesRepo.delete(category);
  }
}
