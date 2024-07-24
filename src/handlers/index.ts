import "source-map-support/register";
import { dispatcher } from "./Dispatcher";
import { settingsController } from "../controllers";

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

export const lambdaHandler = async (event: any) => dispatcher.handler(event);
