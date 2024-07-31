import { Transaction } from "../../src/domains/Transaction";
import { BadRequestError } from "../../src/errors/BadRequestError";
import { CategoriesRepository } from "../../src/repositories/CategoriesRepository";
import { TransactionsRepository } from "../../src/repositories/TransactionsRepository";
import {
  TransactionsServiceImpl,
  TransactionsServiceProps,
} from "../../src/services/TransactionsServiceImpl";

describe("TransactionsService", () => {
  describe("create", () => {
    it("should create a transaction", async () => {
      // Arrange
      const transactionsRepoMock = {
        create: jest.fn(() =>
          Promise.resolve({
            id: "randomId",
            creationDate: 1678734965,
          }),
        ),
      } as unknown as TransactionsRepository;

      const categoriesRepoMock = {
        findById: jest.fn(() =>
          Promise.resolve({
            id: "id",
            user: { id: "userId" },
            icon: "icon",
            name: "name",
            status: "ACTIVE",
            type: "INCOME",
            creationDate: 1678734965,
            lastUpdateDate: 1678734965,
          }),
        ),
      } as unknown as CategoriesRepository;

      const service = new TransactionsServiceImpl({
        transactionsRepo: transactionsRepoMock,
        categoriesRepo: categoriesRepoMock,
      });

      // Act
      const response = await service.create(
        new Transaction({
          user: {
            id: "userId",
          },
          category: {
            id: "categoryId",
          },
          amount: 1000,
          description: "description",
          transactionDate: 1678730000,
        }),
      );

      // Assert
      expect(categoriesRepoMock.findById).toHaveBeenCalledWith(
        "categoryId",
        "userId",
      );

      expect(transactionsRepoMock.create).toHaveBeenCalledWith({
        user: {
          id: "userId",
        },
        category: {
          id: "categoryId",
        },
        amount: 1000,
        description: "description",
        transactionDate: 1678730000,
      });

      expect(response).toEqual({
        id: "randomId",
        creationDate: 1678734965,
      });
    });

    it("should not create a transaction if category status is DELETED", async () => {
      // Arrange
      const transactionsRepoMock = {
        create: jest.fn(() =>
          Promise.resolve({
            id: "randomId",
            creationDate: 1678734965,
          }),
        ),
      } as unknown as TransactionsRepository;

      const categoriesRepoMock = {
        findById: jest.fn(() =>
          Promise.resolve({
            id: "id",
            user: { id: "userId" },
            icon: "icon",
            name: "name",
            status: "DELETED",
            type: "INCOME",
            creationDate: 1678734965,
            lastUpdateDate: 1678734965,
          }),
        ),
      } as unknown as CategoriesRepository;

      const service = new TransactionsServiceImpl({
        transactionsRepo: transactionsRepoMock,
        categoriesRepo: categoriesRepoMock,
      });

      // Act
      expect(
        service.create(
          new Transaction({
            user: {
              id: "userId",
            },
            category: {
              id: "categoryId",
            },
            amount: 1000,
            description: "description",
            transactionDate: 1678730000,
          }),
        ),
      ).rejects.toThrow(
        new BadRequestError({ message: "Category doesn't exist" }),
      );

      // Assert
      expect(categoriesRepoMock.findById).toHaveBeenCalledWith(
        "categoryId",
        "userId",
      );

      expect(transactionsRepoMock.create).not.toHaveBeenCalled();
    });
  });

  describe("findByUserId", () => {
    it("should return all user transactions", async () => {
      // Arrange
      const transactionsRepoMock = {
        findByUserId: jest.fn(() =>
          Promise.resolve([
            {
              id: "id-1",
              user: { id: "userId-1" },
              category: { id: "categoryId-1" },
              amount: 1000,
              description: "description-1",
              transactionDate: 1678730000,
              status: "ACTIVE",
              creationDate: 1678734965,
              lastUpdateDate: 1678734965,
            },
            {
              id: "id-2",
              user: { id: "userId-2" },
              category: { id: "categoryId-2" },
              amount: 1000,
              description: "description-2",
              transactionDate: 1678730000,
              status: "ACTIVE",
              creationDate: 1678734965,
              lastUpdateDate: 1678734965,
            },
          ]),
        ),
      } as unknown as TransactionsRepository;

      const service = new TransactionsServiceImpl({
        transactionsRepo: transactionsRepoMock,
      } as unknown as TransactionsServiceProps);

      // Act
      const response = await service.findByUserId(
        new Transaction({
          user: { id: "userId" },
        }),
      );

      // Assert
      expect(transactionsRepoMock.findByUserId).toHaveBeenCalledWith("userId");

      expect(response).toEqual([
        {
          id: "id-1",
          user: { id: "userId-1" },
          category: { id: "categoryId-1" },
          amount: 1000,
          description: "description-1",
          transactionDate: 1678730000,
          status: "ACTIVE",
          creationDate: 1678734965,
          lastUpdateDate: 1678734965,
        },
        {
          id: "id-2",
          user: { id: "userId-2" },
          category: { id: "categoryId-2" },
          amount: 1000,
          description: "description-2",
          transactionDate: 1678730000,
          status: "ACTIVE",
          creationDate: 1678734965,
          lastUpdateDate: 1678734965,
        },
      ]);
    });
  });

  describe("update", () => {
    it("should update transaction", async () => {
      // Arrange
      const transactionsRepoMock = {
        update: jest.fn(() =>
          Promise.resolve({
            id: "id",
            lastUpdateDate: 1678734965,
          }),
        ),
      } as unknown as TransactionsRepository;

      const categoriesRepoMock = {
        findById: jest.fn(() =>
          Promise.resolve({
            id: "id",
            user: { id: "userId" },
            icon: "icon",
            name: "name",
            status: "ACTIVE",
            type: "INCOME",
            creationDate: 1678734965,
            lastUpdateDate: 1678734965,
          }),
        ),
      } as unknown as CategoriesRepository;

      const service = new TransactionsServiceImpl({
        transactionsRepo: transactionsRepoMock,
        categoriesRepo: categoriesRepoMock,
      });

      // ACt
      const response = await service.update(
        new Transaction({
          id: "id",
          user: { id: "userId" },
          category: { id: "categoryId" },
          amount: 1000,
          description: "description",
          transactionDate: 1678730000,
        }),
      );

      // Assert
      expect(categoriesRepoMock.findById).toHaveBeenCalledWith(
        "categoryId",
        "userId",
      );

      expect(transactionsRepoMock.update).toHaveBeenCalledWith({
        id: "id",
        user: { id: "userId" },
        category: { id: "categoryId" },
        amount: 1000,
        description: "description",
        transactionDate: 1678730000,
      });

      expect(response).toEqual({
        id: "id",
        lastUpdateDate: 1678734965,
      });
    });

    it("should update transaction without categoryId", async () => {
      // Arrange
      const transactionsRepoMock = {
        update: jest.fn(() =>
          Promise.resolve({
            id: "id",
            lastUpdateDate: 1678734965,
          }),
        ),
      } as unknown as TransactionsRepository;

      const categoriesRepoMock = {
        findById: jest.fn(),
      } as unknown as CategoriesRepository;

      const service = new TransactionsServiceImpl({
        transactionsRepo: transactionsRepoMock,
        categoriesRepo: categoriesRepoMock,
      });

      // ACt
      const response = await service.update(
        new Transaction({
          id: "id",
          user: { id: "userId" },
          amount: 1000,
          description: "description",
          transactionDate: 1678730000,
        }),
      );

      // Assert
      expect(categoriesRepoMock.findById).not.toHaveBeenCalled();

      expect(transactionsRepoMock.update).toHaveBeenCalledWith({
        id: "id",
        user: { id: "userId" },
        amount: 1000,
        description: "description",
        transactionDate: 1678730000,
      });

      expect(response).toEqual({
        id: "id",
        lastUpdateDate: 1678734965,
      });
    });

    it("should not update transaction if new category status is DELETED", async () => {
      // Arrange
      const transactionsRepoMock = {
        update: jest.fn(() =>
          Promise.resolve({
            id: "id",
            lastUpdateDate: 1678734965,
          }),
        ),
      } as unknown as TransactionsRepository;

      const categoriesRepoMock = {
        findById: jest.fn(() =>
          Promise.resolve({
            id: "id",
            user: { id: "userId" },
            icon: "icon",
            name: "name",
            status: "DELETED",
            type: "INCOME",
            creationDate: 1678734965,
            lastUpdateDate: 1678734965,
          }),
        ),
      } as unknown as CategoriesRepository;

      const service = new TransactionsServiceImpl({
        transactionsRepo: transactionsRepoMock,
        categoriesRepo: categoriesRepoMock,
      });

      // At
      expect(
        service.update(
          new Transaction({
            id: "id",
            user: { id: "userId" },
            category: { id: "categoryId" },
            amount: 1000,
            description: "description",
            transactionDate: 1678730000,
          }),
        ),
      ).rejects.toThrow(
        new BadRequestError({ message: "Category doesn't exist" }),
      );

      // Assert
      expect(categoriesRepoMock.findById).toHaveBeenCalledWith(
        "categoryId",
        "userId",
      );

      expect(transactionsRepoMock.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete transaction", async () => {
      // Arrange
      const transactionsRepoMock = {
        delete: jest.fn(() => Promise.resolve()),
      } as unknown as TransactionsRepository;

      const service = new TransactionsServiceImpl({
        transactionsRepo: transactionsRepoMock,
      } as unknown as TransactionsServiceProps);

      // Act
      const response = await service.delete(
        new Transaction({
          id: "id",
          user: { id: "userId" },
        }),
      );

      // Assert
      expect(transactionsRepoMock.delete).toHaveBeenCalledWith({
        id: "id",
        user: { id: "userId" },
      });

      expect(response).toBeUndefined();
    });
  });
});
