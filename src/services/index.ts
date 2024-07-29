import {
  categoriesRepo,
  settingsRepo,
  transactionsRepo,
} from "../repositories";
import { CategoriesServiceImpl } from "./CategoriesServiceImpl";
import { SettingsServiceImpl } from "./SettingsServiceImpl";
import { TransactionsServiceImpl } from "./TransactionsServiceImpl";

export const settingsService = new SettingsServiceImpl({
  settingsRepo,
});

export const categoriesService = new CategoriesServiceImpl({
  categoriesRepo,
});

export const transactionsService = new TransactionsServiceImpl({
  transactionsRepo,
  categoriesRepo,
});
