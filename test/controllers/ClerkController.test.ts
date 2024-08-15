import * as lambda from "aws-lambda";
import { ClerkService } from "../../src/services/ClerkService";
import { ClerkController } from "../../src/controllers/ClerkController";
import { SettingsService } from "../../src/services/SettingsService";

describe("Clerk Controller", () => {
  describe("processClerkWebhook", () => {
    it("should create user settings", async () => {
      // Arrange
      const clerkServiceMock = {
        verifyWebhookSignature: jest.fn(() => ({
          data: { id: "userId" },
          type: "user.created",
        })),
      } as unknown as ClerkService;

      const settingsServiceMock = {
        createDefaultSettings: jest.fn(() =>
          Promise.resolve({
            id: "id",
            lastUpdateDate: 1678734965000,
          }),
        ),
      } as unknown as SettingsService;

      const controller = new ClerkController({
        clerkService: clerkServiceMock,
        settingsService: settingsServiceMock,
      });

      // Act
      const response = await controller.processClerkWebhook({
        httpMethod: "POST",
        body: JSON.stringify({
          data: { id: "userId" },
          type: "user.created",
        }),
        headers: {
          "svix-id": "svix-id",
          "svix-signature": "svix-signature",
          "svix-timestamp": "svix-timestamp",
        },
      } as unknown as lambda.APIGatewayEvent);

      // Assert

      expect(clerkServiceMock.verifyWebhookSignature).toHaveBeenCalledWith(
        {
          "svix-id": "svix-id",
          "svix-signature": "svix-signature",
          "svix-timestamp": "svix-timestamp",
        },
        JSON.stringify({
          data: { id: "userId" },
          type: "user.created",
        }),
      );

      expect(settingsServiceMock.createDefaultSettings).toHaveBeenCalledWith(
        "userId",
      );

      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 200,
          body: "",
        }),
      );
    });
  });
});
