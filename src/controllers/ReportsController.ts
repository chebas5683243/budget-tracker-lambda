import * as lambda from "aws-lambda";
import { BaseController } from "./BaseController";
import { ReportsService } from "../services/ReportsService";
import { BadRequestError } from "../errors/BadRequestError";

export interface ReportsControllerProps {
  reportsService: ReportsService;
  config: {
    userId: string;
  };
}

export class ReportsController extends BaseController {
  constructor(protected props: ReportsControllerProps) {
    super(props);
  }

  async getTransactionsPeriods() {
    try {
      const response = await this.props.reportsService.getTransactionsPeriods(
        this.props.config.userId,
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
      const timeframe = event.queryStringParameters?.timeframe;
      const year = Number(event.queryStringParameters?.year);
      const monthParsed = Number(event.queryStringParameters?.month);
      const month = Number.isInteger(monthParsed) ? monthParsed : undefined;

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
          this.props.config.userId,
          {
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
      const startDate = Number(event.queryStringParameters?.startDate);
      const endDate = Number(event.queryStringParameters?.endDate);

      if (!startDate || !endDate || startDate > endDate) {
        throw new BadRequestError({
          message: "Invalid startDate or endDate",
        });
      }

      const response =
        await this.props.reportsService.getTransactionsSummaryByCategoryInPeriod(
          this.props.config.userId,
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
