import "source-map-support/register";
import { dispatcher } from "./Dispatcher";
import {
  categoriesController,
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

dispatcher.get("/settings", () => settingsController.getSettings());

dispatcher.patch("/settings", (event) => settingsController.update(event));

dispatcher.post("/categories", (event) => categoriesController.create(event));

dispatcher.get("/categories", () => categoriesController.findByUserId());

dispatcher.patch("/categories/{categoryId}", (event) =>
  categoriesController.update(event),
);

dispatcher.delete("/categories/{categoryId}", (event) =>
  categoriesController.delete(event),
);

dispatcher.post("/transactions", (event) =>
  transactionsController.create(event),
);

dispatcher.get("/transactions", () => transactionsController.findByUserId());

dispatcher.patch("/transactions/{transactionId}", (event) =>
  transactionsController.update(event),
);

dispatcher.delete("/transactions/{transactionId}", (event) =>
  transactionsController.delete(event),
);

export const lambdaHandler = async (event: any) => dispatcher.handler(event);
