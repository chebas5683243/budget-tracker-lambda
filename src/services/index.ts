import { Webhook } from "svix";
import { CLERK_PUBLIC_KEY, CLERK_WEBHOOK_SECRET } from "../config";
import {
  categoriesRepo,
  settingsRepo,
  transactionsRepo,
} from "../repositories";
import { CategoriesServiceImpl } from "./CategoriesServiceImpl";
import { ClerkServiceImpl } from "./ClerkServiceImpl";
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

export const clerkService = new ClerkServiceImpl({
  config: {
    clerkWebhookVerifier: new Webhook(CLERK_WEBHOOK_SECRET || ""),
  },
});
