import { Category } from "../domains/Category";

export class CategoriesMapper {
  static marshalCategory(category: Category): Record<string, any> {
    return {
      id: category.id,
      userId: category.user.id,
      icon: category.icon,
      name: category.name,
      status: category.status,
      type: category.type,
      creationDate: category.creationDate,
      lastUpdateDate: category.lastUpdateDate,
    };
  }

  static unmarshalCategory(item: Record<string, any>): Category {
    return new Category({
      id: item.id,
      user: { id: item.userId },
      icon: item.icon,
      name: item.name,
      status: item.status,
      type: item.type,
      creationDate: item.creationDate,
      lastUpdateDate: item.lastUpdateDate,
    });
  }
}
