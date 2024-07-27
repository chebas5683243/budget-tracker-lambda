import { DEFAULT_USER_ID } from "../config";
import { categoriesService, settingsService } from "../services";
import { SettingsController } from "./SettingsController";
import { CategoriesController } from "./CategoriesController";

export const settingsController = new SettingsController({
  service: settingsService,
  config: {
    userId: DEFAULT_USER_ID!,
  },
});

export const categoriesController = new CategoriesController({
  categoriesService,
  config: {
    userId: DEFAULT_USER_ID!,
  },
});
