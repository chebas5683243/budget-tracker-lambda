import * as lambda from "aws-lambda";
import { BaseController } from "./BaseController";
import { ReportsService } from "../services/ReportsService";
import { BadRequestError } from "../errors/BadRequestError";

export interface ReportsControllerProps {
  reportsService: ReportsService;
}

export class ReportsController extends BaseController {
  constructor(protected props: ReportsControllerProps) {
    super(props);
  }

  async getTransactionsPeriods(event: lambda.APIGatewayEvent) {
    try {
      const { context } = this.parseRequest(event);

      const response = await this.props.reportsService.getTransactionsPeriods(
        context.userId,
      );

      return this.apiOk({
        body: response,
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }

  async getTransactionsSummaryInTimeframe(event: lambda.APIGatewayEvent) {
    try {
      const { context } = this.parseRequest(event);
      const timezoneOffset =
        Number(event.queryStringParameters?.timezoneOffset) * 60 * 1000;
      const timeframe = event.queryStringParameters?.timeframe;
      const year = Number(event.queryStringParameters?.year);
      const monthParsed = Number(event.queryStringParameters?.month);
      const month = Number.isInteger(monthParsed) ? monthParsed : undefined;

      if (!Number.isInteger(timezoneOffset)) {
        throw new BadRequestError({
          message: "Invalid timezoneOffset",
        });
      }

      if (
        !timeframe ||
        !year ||
        (timeframe !== "month" && timeframe !== "year")
      ) {
        throw new BadRequestError({
          message: "Invalid timeframe or year",
        });
      }

      if (
        timeframe === "month" &&
        (month === undefined || month < 0 || month > 11)
      ) {
        throw new BadRequestError({
          message: "Invalid month: must be between 0 and 11",
        });
      }

      const response =
        await this.props.reportsService.getTransactionsSummaryInTimeframe(
          context.userId,
          {
            timezoneOffset,
            timeframe,
            year,
            month: Number.isInteger(month) ? month : undefined,
          },
        );

      return this.apiOk({
        body: response,
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }

  async getTransactionsSummaryByCategoryInPeriod(
    event: lambda.APIGatewayEvent,
  ) {
    try {
      const { context } = this.parseRequest(event);
      const startDate = Number(event.queryStringParameters?.startDate);
      const endDate = Number(event.queryStringParameters?.endDate);

      if (!startDate || !endDate || startDate > endDate) {
        throw new BadRequestError({
          message: "Invalid startDate or endDate",
        });
      }

      const response =
        await this.props.reportsService.getTransactionsSummaryByCategoryInPeriod(
          context.userId,
          {
            startDate: Number(startDate),
            endDate: Number(endDate),
          },
        );

      return this.apiOk({
        body: response,
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }
}
