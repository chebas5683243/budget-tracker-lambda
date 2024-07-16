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

export const lambdaHandler = async (event: any) => dispatcher.handler(event);
