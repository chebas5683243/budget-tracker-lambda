import { DEFAULT_USER_ID } from "../config";
import {
  categoriesService,
  reportsService,
  securityService,
  settingsService,
  transactionsService,
} from "../services";
import { SettingsController } from "./SettingsController";
import { CategoriesController } from "./CategoriesController";
import { TransactionsController } from "./TransactionsController";
import { ReportsController } from "./ReportsController";
import { SecurityController } from "./SecurityController";

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

export const transactionsController = new TransactionsController({
  transactionsService,
  config: {
    userId: DEFAULT_USER_ID!,
  },
});

export const reportsController = new ReportsController({
  reportsService,
  config: {
    userId: DEFAULT_USER_ID!,
  },
});

export const securityController = new SecurityController({
  securityService,
});
