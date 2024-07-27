import { Category } from "../../src/domains/Category";
import { CategoriesRepository } from "../../src/repositories/CategoriesRepository";
import { CategoriesServiceImpl } from "../../src/services/CategoriesServiceImpl";
import { CategoryType } from "../../src/types/Category";

describe("CategoriesService", () => {
  describe("create", () => {
    it("should create a category", async () => {
      // Arrange
      const categoriesRepoMock = {
        create: jest.fn(() =>
          Promise.resolve({
            id: "randomId",
            creationDate: 1678734965,
          }),
        ),
      } as unknown as CategoriesRepository;

      const service = new CategoriesServiceImpl({
        categoriesRepo: categoriesRepoMock,
      });

      // Act
      const response = await service.create(
        new Category({
          icon: "icon",
          name: "name",
          type: CategoryType.INCOME,
          user: {
            id: "userId",
          },
        }),
      );

      // Assert
      expect(categoriesRepoMock.create).toHaveBeenCalledWith({
        icon: "icon",
        name: "name",
        type: "INCOME",
        user: {
          id: "userId",
        },
      });

      expect(response).toEqual({
        id: "randomId",
        creationDate: 1678734965,
      });
    });
  });

  describe("findByUserId", () => {
    it("should return all user categories", async () => {
      // Arrange
      const categoriesRepoMock = {
        findByUserId: jest.fn(() =>
          Promise.resolve([
            {
              id: "id-1",
              user: { id: "userId" },
              icon: "icon-1",
              name: "name-1",
              status: "ACTIVE",
              type: "INCOME",
              creationDate: 1678734965,
              lastUpdateDate: 1678734965,
            },
            {
              id: "id-2",
              user: { id: "userId" },
              icon: "icon-2",
              name: "name-2",
              status: "ACTIVE",
              type: "EXPENSE",
              creationDate: 1678734965,
              lastUpdateDate: 1678734965,
            },
          ]),
        ),
      } as unknown as CategoriesRepository;

      const service = new CategoriesServiceImpl({
        categoriesRepo: categoriesRepoMock,
      });

      // Act
      const response = await service.findByUserId(
        new Category({
          user: { id: "userId" },
        }),
      );

      // Assert
      expect(categoriesRepoMock.findByUserId).toHaveBeenCalledWith("userId");

      expect(response).toEqual([
        {
          id: "id-1",
          user: { id: "userId" },
          icon: "icon-1",
          name: "name-1",
          status: "ACTIVE",
          type: "INCOME",
          creationDate: 1678734965,
          lastUpdateDate: 1678734965,
        },
        {
          id: "id-2",
          user: { id: "userId" },
          icon: "icon-2",
          name: "name-2",
          status: "ACTIVE",
          type: "EXPENSE",
          creationDate: 1678734965,
          lastUpdateDate: 1678734965,
        },
      ]);
    });
  });

  describe("update", () => {
    it("should update category", async () => {
      // Arrange
      const categoriesRepoMock = {
        update: jest.fn(() =>
          Promise.resolve({
            id: "id",
            lastUpdateDate: 1678734965,
          }),
        ),
      } as unknown as CategoriesRepository;

      const service = new CategoriesServiceImpl({
        categoriesRepo: categoriesRepoMock,
      });

      // ACt
      const response = await service.update(
        new Category({
          id: "id",
          user: { id: "userId" },
          icon: "icon",
          name: "name",
          type: CategoryType.INCOME,
        }),
      );

      // Assert
      expect(categoriesRepoMock.update).toHaveBeenCalledWith({
        id: "id",
        user: { id: "userId" },
        icon: "icon",
        name: "name",
        type: "INCOME",
      });

      expect(response).toEqual({
        id: "id",
        lastUpdateDate: 1678734965,
      });
    });
  });

  describe("delete", () => {
    it("should delete category", async () => {
      // Arrange
      const categoriesRepoMock = {
        delete: jest.fn(() => Promise.resolve()),
      } as unknown as CategoriesRepository;

      const service = new CategoriesServiceImpl({
        categoriesRepo: categoriesRepoMock,
      });

      // Act
      const response = await service.delete(
        new Category({
          id: "id",
          user: { id: "userId" },
        }),
      );

      // Assert
      expect(categoriesRepoMock.delete).toHaveBeenCalledWith({
        id: "id",
        user: { id: "userId" },
      });

      expect(response).toBeUndefined();
    });
  });
});
