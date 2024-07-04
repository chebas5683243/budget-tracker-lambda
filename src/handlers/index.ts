import "source-map-support/register";
import { dispatcher } from "./Dispatcher";

dispatcher.get("/", async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello!",
    }),
  };
});

export const lambdaHandler = async (event: any) => dispatcher.handler(event);
