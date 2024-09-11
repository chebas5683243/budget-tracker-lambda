import { Category } from "../../src/domains/Category";
import { ConflictError } from "../../src/errors/ConflictError";
import { CategoriesRepository } from "../../src/repositories/CategoriesRepository";
import { TransactionsRepository } from "../../src/repositories/TransactionsRepository";
import {
  CategoriesServiceImpl,
  CategoriesServiceProps,
} from "../../src/services/CategoriesServiceImpl";
import { CategoryType } from "../../src/types/Category";

describe("CategoriesService", () => {
  describe("create", () => {
    it("should create a category", async () => {
      // Arrange
      const categoriesRepoMock = {
        create: jest.fn(() =>
          Promise.resolve({
            id: "randomId",
            creationDate: 1678734965000,
          }),
        ),
      } as unknown as CategoriesRepository;

      const service = new CategoriesServiceImpl({
        categoriesRepo: categoriesRepoMock,
      } as unknown as CategoriesServiceProps);

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
        creationDate: 1678734965000,
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
      } as unknown as CategoriesRepository;

      const service = new CategoriesServiceImpl({
        categoriesRepo: categoriesRepoMock,
      } as unknown as CategoriesServiceProps);

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
            lastUpdateDate: 1678734965000,
          }),
        ),
      } as unknown as CategoriesRepository;

      const service = new CategoriesServiceImpl({
        categoriesRepo: categoriesRepoMock,
      } as unknown as CategoriesServiceProps);

      // ACt
      const response = await service.update(
        new Category({
          id: "id",
          user: { id: "userId" },
          icon: "icon",
          name: "name",
        }),
      );

      // Assert
      expect(categoriesRepoMock.update).toHaveBeenCalledWith({
        id: "id",
        user: { id: "userId" },
        icon: "icon",
        name: "name",
      });

      expect(response).toEqual({
        id: "id",
        lastUpdateDate: 1678734965000,
      });
    });
  });

  describe("delete", () => {
    it("should delete category if no transactions are associated", async () => {
      // Arrange
      const categoriesRepoMock = {
        delete: jest.fn(() => Promise.resolve()),
      } as unknown as CategoriesRepository;

      const transactionsRepoMock = {
        findByCategoryId: jest.fn(() => Promise.resolve([])),
      } as unknown as TransactionsRepository;

      const service = new CategoriesServiceImpl({
        categoriesRepo: categoriesRepoMock,
        transactionsRepo: transactionsRepoMock,
      });

      // Act
      const response = await service.delete(
        new Category({
          id: "id",
          user: { id: "userId" },
        }),
      );

      // Assert
      expect(transactionsRepoMock.findByCategoryId).toHaveBeenCalledWith(
        "userId",
        "id",
      );

      expect(categoriesRepoMock.delete).toHaveBeenCalledWith({
        id: "id",
        user: { id: "userId" },
      });

      expect(response).toBeUndefined();
    });

    it("should throw if category to delete has transactions associated", async () => {
      // Arrange
      const categoriesRepoMock = {
        delete: jest.fn(() => Promise.resolve()),
      } as unknown as CategoriesRepository;

      const transactionsRepoMock = {
        findByCategoryId: jest.fn(() =>
          Promise.resolve([
            {
              id: "id-1",
              user: { id: "userId-1" },
              category: { id: "categoryId-1" },
              amount: 1000,
              description: "description-1",
              transactionDate: 1678730000000,
              status: "ACTIVE",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
          ]),
        ),
      } as unknown as TransactionsRepository;

      const service = new CategoriesServiceImpl({
        categoriesRepo: categoriesRepoMock,
        transactionsRepo: transactionsRepoMock,
      });

      // Act
      expect(() =>
        service.delete(
          new Category({
            id: "id",
            user: { id: "userId" },
          }),
        ),
      ).rejects.toThrow(
        new ConflictError({
          detail:
            "Category cannot be deleted because it is associated with active transactions.",
        }),
      );

      // Assert
      expect(transactionsRepoMock.findByCategoryId).toHaveBeenCalledWith(
        "userId",
        "id",
      );

      expect(categoriesRepoMock.delete).not.toHaveBeenCalled();
    });
  });
});
