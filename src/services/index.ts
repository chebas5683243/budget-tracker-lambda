import { categoriesRepo, settingsRepo } from "../repositories";
import { CategoriesServiceImpl } from "./CategoriesServiceImpl";
import { SettingsServiceImpl } from "./SettingsServiceImpl";

export const settingsService = new SettingsServiceImpl({
  settingsRepo,
});

export const categoriesService = new CategoriesServiceImpl({
  categoriesRepo,
});
