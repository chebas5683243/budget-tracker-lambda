import * as lambda from "aws-lambda";
import { BaseController } from "./BaseController";
import { Transaction } from "../domains/Transaction";
import { TransactionsService } from "../services/TransactionsService";

export interface TransactionsControllerProps {
  transactionsService: TransactionsService;
}

export class TransactionsController extends BaseController {
  constructor(protected props: TransactionsControllerProps) {
    super(props);
  }

  async create(event: lambda.APIGatewayEvent) {
    try {
      const { body, context } = this.parseRequest(event);

      const transaction = Transaction.instanceFor("create", {
        user: {
          id: context.userId,
        },
        category: body.category,
        amount: body.amount,
        description: body.description,
        transactionDate: body.transactionDate,
      });

      const response = await this.props.transactionsService.create(transaction);

      return this.apiOk({
        body: response,
        statusCode: 201,
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }

  async findByUserId(event: lambda.APIGatewayEvent) {
    try {
      const { context } = this.parseRequest(event);

      const transaction = Transaction.instanceFor("findByPeriod", {
        user: {
          id: context.userId,
        },
        startDate: Number(event.queryStringParameters?.startDate),
        endDate: Number(event.queryStringParameters?.endDate),
      });

      const response =
        await this.props.transactionsService.findByPeriod(transaction);

      return this.apiOk({
        body: response,
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }

  async update(event: lambda.APIGatewayEvent) {
    try {
      const { body, context } = this.parseRequest(event);

      const transaction = Transaction.instanceFor("update", {
        id: event.pathParameters?.transactionId,
        user: {
          id: context.userId,
        },
        category: body.category,
        amount: body.amount,
        description: body.description,
        transactionDate: body.transactionDate,
      });

      const response = await this.props.transactionsService.update(transaction);

      return this.apiOk({
        body: response,
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }

  async delete(event: lambda.APIGatewayEvent) {
    try {
      const { context } = this.parseRequest(event);

      const transaction = Transaction.instanceFor("delete", {
        id: event.pathParameters?.transactionId,
        user: {
          id: context.userId,
        },
      });

      await this.props.transactionsService.delete(transaction);

      return this.apiOk({
        statusCode: 204,
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }
}
