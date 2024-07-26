import { Category } from "../domains/Category";
import { CategoriesRepository } from "../repositories/CategoriesRepository";
import { CategoriesService } from "./CategoriesService";

export interface CategoriesServiceProps {
  categoriesRepo: CategoriesRepository;
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
    await this.props.categoriesRepo.delete(category);
  }
}
