import {
  categoriesService,
  clerkService,
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
import { ClerkController } from "./ClerkController";

export const settingsController = new SettingsController({
  service: settingsService,
});

export const categoriesController = new CategoriesController({
  categoriesService,
});

export const transactionsController = new TransactionsController({
  transactionsService,
});

export const reportsController = new ReportsController({
  reportsService,
});

export const securityController = new SecurityController({
  securityService,
});

export const clerkController = new ClerkController({
  clerkService,
  settingsService,
});
