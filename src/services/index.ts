import { CLERK_PUBLIC_KEY } from "../config";
import {
  categoriesRepo,
  settingsRepo,
  transactionsRepo,
} from "../repositories";
import { CategoriesServiceImpl } from "./CategoriesServiceImpl";
import { ReportsServiceImpl } from "./ReportsServiceImpl";
import { SecurityServiceImpl } from "./SecurityServiceImpl";
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

export const reportsService = new ReportsServiceImpl({
  transactionsRepo,
  categoriesRepo,
});

export const securityService = new SecurityServiceImpl({
  config: {
    clerkPublickKey: CLERK_PUBLIC_KEY,
  },
});
