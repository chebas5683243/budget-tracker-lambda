import { CategoriesRepository } from "../../src/repositories/CategoriesRepository";
import { TransactionsRepository } from "../../src/repositories/TransactionsRepository";
import {
  ReportsServiceImpl,
  ReportsServiceProps,
} from "../../src/services/ReportsServiceImpl";

describe("ReportsService", () => {
  describe("getTransactionsPeriods", () => {
    it("should return year periods of the user transactions", async () => {
      // Arrange
      const transactionsRepoMock = {
        findByUserId: jest.fn(() =>
          Promise.resolve([
            {
              id: "id-1",
              user: { id: "userId" },
              category: { id: "categoryId-1" },
              amount: 1000,
              description: "description-1",
              transactionDate: 1722384000000,
              status: "ACTIVE",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
            {
              id: "id-2",
              user: { id: "userId" },
              category: { id: "categoryId-2" },
              amount: 1000,
              description: "description-2",
              transactionDate: 1708992000000,
              status: "ACTIVE",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
            {
              id: "id-3",
              user: { id: "userId" },
              category: { id: "categoryId-3" },
              amount: 1000,
              description: "description-3",
              transactionDate: 1677456000000,
              status: "ACTIVE",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
          ]),
        ),
      } as unknown as TransactionsRepository;

      const service = new ReportsServiceImpl({
        transactionsRepo: transactionsRepoMock,
      } as unknown as ReportsServiceProps);

      // Act
      const response = await service.getTransactionsPeriods("userId");

      // Assert
      expect(transactionsRepoMock.findByUserId).toHaveBeenCalledWith("userId");

      expect(response).toEqual([2023, 2024]);
    });
  });

  describe("getTransactionsSummaryInTimeframe", () => {
    it("should return transactions data summary by days in a month", async () => {
      // Arrange
      const transactionsRepoMock = {
        findByPeriod: jest.fn(() =>
          Promise.resolve([
            {
              id: "id-1",
              user: { id: "userId" },
              category: { id: "categoryId-1" },
              amount: 300,
              description: "description-1",
              transactionDate: 1628294400000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-2",
              user: { id: "userId" },
              category: { id: "categoryId-3" },
              amount: 200,
              description: "description-2",
              transactionDate: 1628294400000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-3",
              user: { id: "userId" },
              category: { id: "categoryId-2" },
              amount: 700,
              description: "description-3",
              transactionDate: 1628294400000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-4",
              user: { id: "userId" },
              category: { id: "categoryId-3" },
              amount: 400,
              description: "description-4",
              transactionDate: 1628294400000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-5",
              user: { id: "userId" },
              category: { id: "categoryId-2" },
              amount: 1300,
              description: "description-5",
              transactionDate: 1628640000000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-6",
              user: { id: "userId" },
              category: { id: "categoryId-3" },
              amount: 600,
              description: "description-6",
              transactionDate: 1628812800000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-7",
              user: { id: "userId" },
              category: { id: "categoryId-1" },
              amount: 100,
              description: "description-7",
              transactionDate: 1630368000000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-8",
              user: { id: "userId" },
              category: { id: "categoryId-2" },
              amount: 330,
              description: "description-8",
              transactionDate: 1630368000000,
              status: "ACTIVE",
              creationDate: 1630368000000,
              lastUpdateDate: 1625616000000,
            },
          ]),
        ),
      } as unknown as TransactionsRepository;

      const categoriesRepoMock = {
        findByUserId: jest.fn(() =>
          Promise.resolve([
            {
              id: "categoryId-1",
              user: { id: "userId" },
              icon: "icon-1",
              name: "name-1",
              status: "ACTIVE",
              type: "EXPENSE",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
            {
              id: "categoryId-2",
              user: { id: "userId" },
              icon: "icon-2",
              name: "name-2",
              status: "ACTIVE",
              type: "INCOME",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
            {
              id: "categoryId-3",
              user: { id: "userId" },
              icon: "icon-3",
              name: "name-3",
              status: "ACTIVE",
              type: "EXPENSE",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
          ]),
        ),
      } as unknown as CategoriesRepository;

      const service = new ReportsServiceImpl({
        transactionsRepo: transactionsRepoMock,
        categoriesRepo: categoriesRepoMock,
      });

      // Act
      const response = await service.getTransactionsSummaryInTimeframe(
        "userId",
        { timeframe: "month", year: 2021, month: 7 },
      );

      // Assert
      expect(transactionsRepoMock.findByPeriod).toHaveBeenCalledWith(
        "userId",
        1627776000000,
        1630454399999,
      );

      expect(categoriesRepoMock.findByUserId).toHaveBeenCalledWith("userId");

      expect(response).toEqual([
        { year: 2021, month: 7, day: 1, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 2, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 3, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 4, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 5, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 6, balance: { expense: 0, income: 0 } },
        {
          year: 2021,
          month: 7,
          day: 7,
          balance: { expense: 900, income: 700 },
        },
        { year: 2021, month: 7, day: 8, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 9, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 10, balance: { expense: 0, income: 0 } },
        {
          year: 2021,
          month: 7,
          day: 11,
          balance: { expense: 0, income: 1300 },
        },
        { year: 2021, month: 7, day: 12, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 13, balance: { expense: 600, income: 0 } },
        { year: 2021, month: 7, day: 14, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 15, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 16, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 17, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 18, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 19, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 20, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 21, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 22, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 23, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 24, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 25, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 26, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 27, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 28, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 29, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, day: 30, balance: { expense: 0, income: 0 } },
        {
          year: 2021,
          month: 7,
          day: 31,
          balance: { expense: 100, income: 330 },
        },
      ]);
    });

    it("should return transactions data summary by months in a year", async () => {
      // Arrange
      const transactionsRepoMock = {
        findByPeriod: jest.fn(() =>
          Promise.resolve([
            {
              id: "id-1",
              user: { id: "userId" },
              category: { id: "categoryId-1" },
              amount: 300,
              description: "description-1",
              transactionDate: 1615420800000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-2",
              user: { id: "userId" },
              category: { id: "categoryId-3" },
              amount: 200,
              description: "description-2",
              transactionDate: 1615939200000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-3",
              user: { id: "userId" },
              category: { id: "categoryId-2" },
              amount: 700,
              description: "description-3",
              transactionDate: 1616630400000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-4",
              user: { id: "userId" },
              category: { id: "categoryId-3" },
              amount: 400,
              description: "description-4",
              transactionDate: 1617148800000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-5",
              user: { id: "userId" },
              category: { id: "categoryId-2" },
              amount: 1300,
              description: "description-5",
              transactionDate: 1617235200000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-6",
              user: { id: "userId" },
              category: { id: "categoryId-3" },
              amount: 600,
              description: "description-6",
              transactionDate: 1629676800000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-7",
              user: { id: "userId" },
              category: { id: "categoryId-1" },
              amount: 100,
              description: "description-7",
              transactionDate: 1635811200000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-8",
              user: { id: "userId" },
              category: { id: "categoryId-2" },
              amount: 330,
              description: "description-8",
              transactionDate: 1637452800000,
              status: "ACTIVE",
              creationDate: 1630368000000,
              lastUpdateDate: 1625616000000,
            },
          ]),
        ),
      } as unknown as TransactionsRepository;

      const categoriesRepoMock = {
        findByUserId: jest.fn(() =>
          Promise.resolve([
            {
              id: "categoryId-1",
              user: { id: "userId" },
              icon: "icon-1",
              name: "name-1",
              status: "ACTIVE",
              type: "EXPENSE",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
            {
              id: "categoryId-2",
              user: { id: "userId" },
              icon: "icon-2",
              name: "name-2",
              status: "ACTIVE",
              type: "INCOME",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
            {
              id: "categoryId-3",
              user: { id: "userId" },
              icon: "icon-3",
              name: "name-3",
              status: "ACTIVE",
              type: "EXPENSE",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
          ]),
        ),
      } as unknown as CategoriesRepository;

      const service = new ReportsServiceImpl({
        transactionsRepo: transactionsRepoMock,
        categoriesRepo: categoriesRepoMock,
      });

      // Act
      const response = await service.getTransactionsSummaryInTimeframe(
        "userId",
        { timeframe: "year", year: 2021 },
      );

      // Assert
      expect(transactionsRepoMock.findByPeriod).toHaveBeenCalledWith(
        "userId",
        1609459200000,
        1640995199999,
      );

      expect(categoriesRepoMock.findByUserId).toHaveBeenCalledWith("userId");

      expect(response).toEqual([
        { year: 2021, month: 0, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 1, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 2, balance: { expense: 900, income: 700 } },
        { year: 2021, month: 3, balance: { expense: 0, income: 1300 } },
        { year: 2021, month: 4, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 5, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 6, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 7, balance: { expense: 600, income: 0 } },
        { year: 2021, month: 8, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 9, balance: { expense: 0, income: 0 } },
        { year: 2021, month: 10, balance: { expense: 100, income: 330 } },
        { year: 2021, month: 11, balance: { expense: 0, income: 0 } },
      ]);
    });
  });

  describe("getTransactionsSummaryByCategoryInPeriod", () => {
    it("should return the sum of transactions group by categories", async () => {
      // Arrange
      const transactionsRepoMock = {
        findByPeriod: jest.fn(() =>
          Promise.resolve([
            {
              id: "id-1",
              user: { id: "userId" },
              category: { id: "categoryId-1" },
              amount: 300,
              description: "description-1",
              transactionDate: 1615420800000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-2",
              user: { id: "userId" },
              category: { id: "categoryId-3" },
              amount: 200,
              description: "description-2",
              transactionDate: 1615939200000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-3",
              user: { id: "userId" },
              category: { id: "categoryId-2" },
              amount: 700,
              description: "description-3",
              transactionDate: 1616630400000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-4",
              user: { id: "userId" },
              category: { id: "categoryId-3" },
              amount: 400,
              description: "description-4",
              transactionDate: 1617148800000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-5",
              user: { id: "userId" },
              category: { id: "categoryId-2" },
              amount: 1300,
              description: "description-5",
              transactionDate: 1617235200000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-6",
              user: { id: "userId" },
              category: { id: "categoryId-3" },
              amount: 600,
              description: "description-6",
              transactionDate: 1629676800000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-7",
              user: { id: "userId" },
              category: { id: "categoryId-1" },
              amount: 100,
              description: "description-7",
              transactionDate: 1635811200000,
              status: "ACTIVE",
              creationDate: 1625616000000,
              lastUpdateDate: 1625616000000,
            },
            {
              id: "id-8",
              user: { id: "userId" },
              category: { id: "categoryId-2" },
              amount: 330,
              description: "description-8",
              transactionDate: 1637452800000,
              status: "ACTIVE",
              creationDate: 1630368000000,
              lastUpdateDate: 1625616000000,
            },
          ]),
        ),
      } as unknown as TransactionsRepository;

      const categoriesRepoMock = {
        findByUserId: jest.fn(() =>
          Promise.resolve([
            {
              id: "categoryId-1",
              user: { id: "userId" },
              icon: "icon-1",
              name: "name-1",
              status: "ACTIVE",
              type: "EXPENSE",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
            {
              id: "categoryId-2",
              user: { id: "userId" },
              icon: "icon-2",
              name: "name-2",
              status: "ACTIVE",
              type: "INCOME",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
            {
              id: "categoryId-3",
              user: { id: "userId" },
              icon: "icon-3",
              name: "name-3",
              status: "ACTIVE",
              type: "EXPENSE",
              creationDate: 1678734965000,
              lastUpdateDate: 1678734965000,
            },
          ]),
        ),
      } as unknown as CategoriesRepository;

      const service = new ReportsServiceImpl({
        transactionsRepo: transactionsRepoMock,
        categoriesRepo: categoriesRepoMock,
      });

      // Act
      const response = await service.getTransactionsSummaryByCategoryInPeriod(
        "userId",
        { startDate: 1625616000000, endDate: 1628294400000 },
      );

      // Assert
      expect(transactionsRepoMock.findByPeriod).toHaveBeenCalledWith(
        "userId",
        1625616000000,
        1628294400000,
      );

      expect(categoriesRepoMock.findByUserId).toHaveBeenCalledWith("userId");

      expect(response).toEqual([
        {
          category: {
            id: "categoryId-2",
            user: { id: "userId" },
            icon: "icon-2",
            name: "name-2",
            status: "ACTIVE",
            type: "INCOME",
            creationDate: 1678734965000,
            lastUpdateDate: 1678734965000,
          },
          sum: { amount: 2330 },
        },
        {
          category: {
            id: "categoryId-3",
            user: { id: "userId" },
            icon: "icon-3",
            name: "name-3",
            status: "ACTIVE",
            type: "EXPENSE",
            creationDate: 1678734965000,
            lastUpdateDate: 1678734965000,
          },
          sum: { amount: 1200 },
        },
        {
          category: {
            id: "categoryId-1",
            user: { id: "userId" },
            icon: "icon-1",
            name: "name-1",
            status: "ACTIVE",
            type: "EXPENSE",
            creationDate: 1678734965000,
            lastUpdateDate: 1678734965000,
          },
          sum: { amount: 400 },
        },
      ]);
    });
  });
});
