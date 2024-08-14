import "source-map-support/register";
import * as lambda from "aws-lambda";
import { dispatcher } from "./Dispatcher";
import { logger } from "../logging";
import {
  categoriesController,
  reportsController,
  securityController,
  settingsController,
  transactionsController,
} from "../controllers";

dispatcher.get("/", async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello!",
    }),
  };
});

dispatcher.get("/settings", (event) => settingsController.getSettings(event));

dispatcher.patch("/settings", (event) => settingsController.update(event));

dispatcher.post("/categories", (event) => categoriesController.create(event));

dispatcher.get("/categories", (event) =>
  categoriesController.findByUserId(event),
);

dispatcher.patch("/categories/{categoryId}", (event) =>
  categoriesController.update(event),
);

dispatcher.delete("/categories/{categoryId}", (event) =>
  categoriesController.delete(event),
);

dispatcher.post("/transactions", (event) =>
  transactionsController.create(event),
);

dispatcher.get("/transactions", (event) =>
  transactionsController.findByUserId(event),
);

dispatcher.patch("/transactions/{transactionId}", (event) =>
  transactionsController.update(event),
);

dispatcher.delete("/transactions/{transactionId}", (event) =>
  transactionsController.delete(event),
);

dispatcher.get("/reports/history-periods", (event) =>
  reportsController.getTransactionsPeriods(event),
);

dispatcher.get("/reports/history-data", (event) =>
  reportsController.getTransactionsSummaryInTimeframe(event),
);

dispatcher.get("/reports/categories-overview", (event) =>
  reportsController.getTransactionsSummaryByCategoryInPeriod(event),
);

dispatcher.post("/webhook/clerk", async (event) => {
  logger.info("clerk event", { ...event });
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from webhook!",
    }),
  };
});

dispatcher.custom((event: lambda.APIGatewayTokenAuthorizerEvent) => {
  if (event.type === "TOKEN") {
    return securityController.authorizeApiCall(event);
  }

  logger.info("Authorizer event not supported", { ...event });
  throw new Error("Unauthorized");
});

export const lambdaHandler = async (event: any) => dispatcher.handler(event);
