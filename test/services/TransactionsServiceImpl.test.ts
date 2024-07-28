import { Transaction } from "../../src/domains/Transaction";
import { TransactionsRepository } from "../../src/repositories/TransactionsRepository";
import { TransactionsServiceImpl } from "../../src/services/TransactionsServiceImpl";

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

      const service = new TransactionsServiceImpl({
        transactionsRepo: transactionsRepoMock,
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
      });

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

      const service = new TransactionsServiceImpl({
        transactionsRepo: transactionsRepoMock,
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
  });

  describe("delete", () => {
    it("should delete transaction", async () => {
      // Arrange
      const transactionsRepoMock = {
        delete: jest.fn(() => Promise.resolve()),
      } as unknown as TransactionsRepository;

      const service = new TransactionsServiceImpl({
        transactionsRepo: transactionsRepoMock,
      });

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
