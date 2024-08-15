import { Webhook, WebhookRequiredHeaders } from "svix";
import { ClerkServiceImpl } from "../../src/services/ClerkServiceImpl";
import { UnauthorizedError } from "../../src/errors/UnauthorizedError";

describe("ClerkService", () => {
  describe("verifyWebhookSignature", () => {
    it("should verify webhook request", () => {
      // Arrange
      const verifierMock = {
        verify: jest.fn(() => ({
          data: {
            id: "userId",
          },
          type: "user.created",
        })),
      } as unknown as Webhook;

      const service = new ClerkServiceImpl({
        config: {
          clerkWebhookVerifier: verifierMock,
        },
      });

      // Act
      const response = service.verifyWebhookSignature(
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

      // Assert
      expect(verifierMock.verify).toHaveBeenCalledWith(
        JSON.stringify({
          data: { id: "userId" },
          type: "user.created",
        }),
        {
          "svix-id": "svix-id",
          "svix-signature": "svix-signature",
          "svix-timestamp": "svix-timestamp",
        },
      );

      expect(response).toStrictEqual({
        data: { id: "userId" },
        type: "user.created",
      });
    });

    it("should throw if headers are missing", () => {
      // Arrange
      const verifierMock = {
        verify: jest.fn(),
      } as unknown as Webhook;

      const service = new ClerkServiceImpl({
        config: {
          clerkWebhookVerifier: verifierMock,
        },
      });

      // Act
      expect(() =>
        service.verifyWebhookSignature(
          {} as WebhookRequiredHeaders,
          JSON.stringify({
            data: { id: "userId" },
            type: "user.created",
          }),
        ),
      ).toThrow(
        new UnauthorizedError({
          detail: "Invalid signature or payload",
        }),
      );

      // Assert
      expect(verifierMock.verify).not.toHaveBeenCalled();
    });

    it("should throw if payload is missing", () => {
      // Arrange
      const verifierMock = {
        verify: jest.fn(),
      } as unknown as Webhook;

      const service = new ClerkServiceImpl({
        config: {
          clerkWebhookVerifier: verifierMock,
        },
      });

      // Act
      expect(() =>
        service.verifyWebhookSignature(
          {
            "svix-id": "svix-id",
            "svix-signature": "svix-signature",
            "svix-timestamp": "svix-timestamp",
          },
          null,
        ),
      ).toThrow(
        new UnauthorizedError({
          detail: "Invalid signature or payload",
        }),
      );

      // Assert
      expect(verifierMock.verify).not.toHaveBeenCalled();
    });
  });
});
