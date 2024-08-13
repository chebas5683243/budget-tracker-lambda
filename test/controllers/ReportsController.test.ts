import * as lambda from "aws-lambda";
import { ReportsController } from "../../src/controllers/ReportsController";
import { ReportsService } from "../../src/services/ReportsService";

describe("ReportsController", () => {
  describe("getTransactionsPeriods", () => {
    it("should return transactions periods", async () => {
      // Arrange
      const reportsServiceMock = {
        getTransactionsPeriods: jest.fn(() => Promise.resolve([2023, 2024])),
      } as unknown as ReportsService;

      const controller = new ReportsController({
        reportsService: reportsServiceMock,
      });

      // Act
      const response = await controller.getTransactionsPeriods({
        requestContext: {
          authorizer: {
            userId: "userId",
          },
        },
      } as unknown as lambda.APIGatewayEvent);

      // Asset
      expect(reportsServiceMock.getTransactionsPeriods).toHaveBeenCalledWith(
        "userId",
      );

      expect(response).toEqual(
        expect.objectContaining({
          body: JSON.stringify([2023, 2024]),
          statusCode: 200,
        }),
      );
    });
  });

  describe("getTransactionsSummaryInTimeframe", () => {
    it("should return transactions summary", async () => {
      // Arrange
      const reportsServiceMock = {
        getTransactionsSummaryInTimeframe: jest.fn(() =>
          Promise.resolve([
            { year: 2021, month: 0, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 1, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 2, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 3, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 4, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 5, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 6, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 7, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 8, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 9, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 10, balance: { expense: 100, income: 330 } },
            { year: 2021, month: 11, balance: { expense: 0, income: 0 } },
          ]),
        ),
      } as unknown as ReportsService;

      const controller = new ReportsController({
        reportsService: reportsServiceMock,
      });

      // Act
      const response = await controller.getTransactionsSummaryInTimeframe({
        queryStringParameters: {
          timeframe: "year",
          year: "2021",
        },
        requestContext: {
          authorizer: {
            userId: "userId",
          },
        },
      } as unknown as lambda.APIGatewayEvent);

      // Assert
      expect(
        reportsServiceMock.getTransactionsSummaryInTimeframe,
      ).toHaveBeenCalledWith("userId", {
        timeframe: "year",
        year: 2021,
      });

      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 200,
          body: JSON.stringify([
            { year: 2021, month: 0, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 1, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 2, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 3, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 4, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 5, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 6, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 7, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 8, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 9, balance: { expense: 0, income: 0 } },
            { year: 2021, month: 10, balance: { expense: 100, income: 330 } },
            { year: 2021, month: 11, balance: { expense: 0, income: 0 } },
          ]),
        }),
      );
    });

    it("should return bad request error if invalid timeframe or year", async () => {
      // Arrange
      const reportsServiceMock = {
        getTransactionsSummaryInTimeframe: jest.fn(() => Promise.resolve()),
      } as unknown as ReportsService;

      const controller = new ReportsController({
        reportsService: reportsServiceMock,
      });

      // Act
      const response = await controller.getTransactionsSummaryInTimeframe({
        queryStringParameters: {
          timeframe: "day",
          year: "2021",
        },
        requestContext: {
          authorizer: {
            userId: "userId",
          },
        },
      } as unknown as lambda.APIGatewayEvent);

      // Assert
      expect(
        reportsServiceMock.getTransactionsSummaryInTimeframe,
      ).not.toHaveBeenCalled();

      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 400,
          body: JSON.stringify({
            code: "0.1.0",
            message: "Invalid timeframe or year",
          }),
        }),
      );
    });
    it("should return bad request error if invalid month", async () => {
      // Arrange
      const reportsServiceMock = {
        getTransactionsSummaryInTimeframe: jest.fn(() => Promise.resolve()),
      } as unknown as ReportsService;

      const controller = new ReportsController({
        reportsService: reportsServiceMock,
      });

      // Act
      const response = await controller.getTransactionsSummaryInTimeframe({
        queryStringParameters: {
          timeframe: "month",
          year: "2021",
        },
        requestContext: {
          authorizer: {
            userId: "userId",
          },
        },
      } as unknown as lambda.APIGatewayEvent);

      // Assert
      expect(
        reportsServiceMock.getTransactionsSummaryInTimeframe,
      ).not.toHaveBeenCalled();

      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 400,
          body: JSON.stringify({
            code: "0.1.0",
            message: "Invalid month: must be between 0 and 11",
          }),
        }),
      );
    });
  });

  describe("getTransactionsSummaryByCategoryInPeriod", () => {
    it("should return transactions summary grouped by categories", async () => {
      // Arrange
      const reportsServiceMock = {
        getTransactionsSummaryByCategoryInPeriod: jest.fn(() =>
          Promise.resolve([
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
          ]),
        ),
      } as unknown as ReportsService;

      const controller = new ReportsController({
        reportsService: reportsServiceMock,
      });

      // Act
      const response =
        await controller.getTransactionsSummaryByCategoryInPeriod({
          queryStringParameters: {
            startDate: "1678734965000",
            endDate: "1678735965000",
          },
          requestContext: {
            authorizer: {
              userId: "userId",
            },
          },
        } as unknown as lambda.APIGatewayEvent);

      // Assert
      expect(
        reportsServiceMock.getTransactionsSummaryByCategoryInPeriod,
      ).toHaveBeenCalledWith("userId", {
        startDate: 1678734965000,
        endDate: 1678735965000,
      });

      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 200,
          body: JSON.stringify([
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
          ]),
        }),
      );
    });

    it("should return bad request error if invalid date range", async () => {
      // Arrange
      const reportsServiceMock = {
        getTransactionsSummaryByCategoryInPeriod: jest.fn(() =>
          Promise.resolve(),
        ),
      } as unknown as ReportsService;

      const controller = new ReportsController({
        reportsService: reportsServiceMock,
      });

      // Act
      const response =
        await controller.getTransactionsSummaryByCategoryInPeriod({
          queryStringParameters: {
            startDate: "1678734965000",
          },
          requestContext: {
            authorizer: {
              userId: "userId",
            },
          },
        } as unknown as lambda.APIGatewayEvent);

      // Assert
      expect(
        reportsServiceMock.getTransactionsSummaryByCategoryInPeriod,
      ).not.toHaveBeenCalled();

      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 400,
          body: JSON.stringify({
            code: "0.1.0",
            message: "Invalid startDate or endDate",
          }),
        }),
      );
    });
  });
});

jest.mock("../../src/logging", () => ({
  logger: { info: jest.fn(), error: jest.fn() },
}));
