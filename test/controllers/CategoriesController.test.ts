import * as lambda from "aws-lambda";
import { CategoriesService } from "../../src/services/CategoriesService";
import { CategoriesController } from "../../src/controllers/CategoriesController";

describe("CategoriesController", () => {
  describe("create", () => {
    it("should create a new category", async () => {
      // Arrange
      process.env.DEFAULT_USER_ID = "userId";

      const categoriesServiceMock = {
        create: jest.fn(() =>
          Promise.resolve({
            id: "randomId",
            creationDate: 1678734965000,
          }),
        ),
      } as unknown as CategoriesService;

      const controller = new CategoriesController({
        categoriesService: categoriesServiceMock,
      });

      // Act
      const response = await controller.create({
        body: JSON.stringify({
          name: "name",
          icon: "icon",
          type: "INCOME",
        }),
        requestContext: {
          authorizer: {
            userId: "userId",
          },
        },
      } as unknown as lambda.APIGatewayEvent);

      // Assert
      expect(categoriesServiceMock.create).toHaveBeenCalledWith({
        user: { id: "userId" },
        name: "name",
        icon: "icon",
        type: "INCOME",
      });

      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 201,
          body: JSON.stringify({
            id: "randomId",
            creationDate: 1678734965000,
          }),
        }),
      );
    });
  });

  describe("findByUserId", () => {
    it("should return all user categories", async () => {
      // Arrange
      const categoriesServiceMock = {
        findByUserId: jest.fn(() =>
          Promise.resolve([
            {
              id: "id-1",
              user: { id: "userId" },
              icon: "icon-1",
              name: "name-1",
              status: "ACTIVE",
              type: "INCOME",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
            {
              id: "id-2",
              user: { id: "userId" },
              icon: "icon-2",
              name: "name-2",
              status: "ACTIVE",
              type: "EXPENSE",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
          ]),
        ),
      } as unknown as CategoriesService;

      const controller = new CategoriesController({
        categoriesService: categoriesServiceMock,
      });

      // Act
      const response = await controller.findByUserId({
        requestContext: {
          authorizer: {
            userId: "userId",
          },
        },
      } as unknown as lambda.APIGatewayEvent);

      // Assert
      expect(categoriesServiceMock.findByUserId).toHaveBeenCalledWith({
        user: { id: "userId" },
      });

      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 200,
          body: JSON.stringify([
            {
              id: "id-1",
              user: { id: "userId" },
              icon: "icon-1",
              name: "name-1",
              status: "ACTIVE",
              type: "INCOME",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
            {
              id: "id-2",
              user: { id: "userId" },
              icon: "icon-2",
              name: "name-2",
              status: "ACTIVE",
              type: "EXPENSE",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
          ]),
        }),
      );
    });
  });

  describe("update", () => {
    it("should update category", async () => {
      // Arrange
      const categoriesServiceMock = {
        update: jest.fn(() =>
          Promise.resolve({
            id: "id",
            lastUpdateDate: 1678734965000,
          }),
        ),
      } as unknown as CategoriesService;

      const controller = new CategoriesController({
        categoriesService: categoriesServiceMock,
      });

      // Act
      const response = await controller.update({
        pathParameters: { categoryId: "id" },
        body: JSON.stringify({
          name: "name",
          icon: "icon",
        }),
        requestContext: {
          authorizer: {
            userId: "userId",
          },
        },
      } as unknown as lambda.APIGatewayEvent);

      // Assert
      expect(categoriesServiceMock.update).toHaveBeenCalledWith({
        id: "id",
        user: { id: "userId" },
        icon: "icon",
        name: "name",
      });

      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 200,
          body: JSON.stringify({
            id: "id",
            lastUpdateDate: 1678734965000,
          }),
        }),
      );
    });
  });

  describe("delete", () => {
    it("should delete category", async () => {
      // Arrange
      const categoriesServiceMock = {
        delete: jest.fn(() => Promise.resolve()),
      } as unknown as CategoriesService;

      const controller = new CategoriesController({
        categoriesService: categoriesServiceMock,
      });

      // Act
      const response = await controller.delete({
        pathParameters: { categoryId: "id" },
        requestContext: {
          authorizer: {
            userId: "userId",
          },
        },
      } as unknown as lambda.APIGatewayEvent);

      // Assert
      expect(categoriesServiceMock.delete).toHaveBeenCalledWith({
        id: "id",
        user: { id: "userId" },
      });

      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 204,
          body: "",
        }),
      );
    });
  });
});
