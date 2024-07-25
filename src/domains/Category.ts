import { BadRequestError } from "../errors/BadRequestError";
import { CategoryStatus, CategoryType } from "../types/Category";
import {
  CategoriesValidator,
  CategoriesValidatorMethods,
} from "../validators/CategoriesValidator";
import { User } from "./User";

export class Category {
  id: string;

  user: Partial<User>;

  name: string;

  icon: string;

  type: CategoryType;

  status: CategoryStatus;

  creationDate: number;

  lastUpdateDate: number;

  constructor(data?: Partial<Category>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  static instanceFor(
    instanceSchema: CategoriesValidatorMethods,
    data?: Partial<Category>,
  ) {
    const validation = CategoriesValidator[instanceSchema].safeParse(data);

    if (!validation.success) {
      throw new BadRequestError({
        message: `InvalidSettingAttributes : ${JSON.stringify(validation.error.errors)}`,
      });
    }

    return new Category(validation.data);
  }
}
