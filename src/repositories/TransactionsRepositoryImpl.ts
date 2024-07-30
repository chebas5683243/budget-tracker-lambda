import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { AbstractDynamoDbRepository } from "./AbstractDynamoDbRepository";
import { TransactionsRepository } from "./TransactionsRepository";
import { Transaction } from "../domains/Transaction";
import { TransactionsMapper } from "../mappers/TransactionsMapper";
import { TransactionStatus } from "../types/Transaction";
import { GlobalError } from "../errors/GlobalError";
import { UnknownError } from "../errors/UnknownError";
import { NotFoundError } from "../errors/NotFoundError";

export interface TransactionsRepositoryProps {
  dynamoDbClient: DynamoDBDocumentClient;
  config: {
    transactionsTable?: string;
  };
}

export class TransactionsRepositoryImpl
  extends AbstractDynamoDbRepository
  implements TransactionsRepository
{
  constructor(private props: TransactionsRepositoryProps) {
    super();
  }

  async create(transaction: Transaction): Promise<Transaction> {
    try {
      const request = TransactionsMapper.marshalTransaction({
        ...transaction,
        id: this.getUUID(),
        creationDate: this.getTimestamp(),
        status: TransactionStatus.ACTIVE,
      });

      await this.props.dynamoDbClient.send(
        new PutCommand({
          Item: request,
          TableName: this.props.config.transactionsTable,
          ConditionExpression: "attribute_not_exists(id)",
        }),
      );

      return new Transaction({
        id: request?.id,
        creationDate: request?.creationDate,
      });
    } catch (e: any) {
      if (e instanceof GlobalError) {
        throw e;
      }
      throw new UnknownError({ detail: e.message });
    }
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    try {
      const { Items: items } = await this.props.dynamoDbClient.send(
        new QueryCommand({
          TableName: this.props.config.transactionsTable,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: { ":userId": userId },
        }),
      );

      if (items) {
        return items.reduce((prev: Transaction[], curr) => {
          if (curr.status === TransactionStatus.DELETED) return prev;
          return [...prev, TransactionsMapper.unmarshalTransaction(curr)];
        }, []);
      }

      throw new NotFoundError();
    } catch (e: any) {
      if (e instanceof GlobalError) {
        throw e;
      }
      throw new UnknownError({ detail: e.message });
    }
  }

  async update(transaction: Transaction): Promise<Transaction> {
    try {
      const request = TransactionsMapper.marshalTransaction({
        ...transaction,
        lastUpdateDate: this.getTimestamp(),
      });

      const updateExpression = this.getUpdateExpression(request, [
        "amount",
        "description",
        "categoryId",
        "transactionDate",
        "lastUpdateDate",
      ]);

      const { Attributes: updatedItem } = await this.props.dynamoDbClient.send(
        new UpdateCommand({
          TableName: this.props.config.transactionsTable,
          Key: {
            userId: request.userId,
            id: request.id,
          },
          ConditionExpression: "attribute_exists(id) AND status = ACTIVE",
          ReturnValues: "ALL_NEW",
          ...updateExpression,
        }),
      );

      return new Transaction({
        id: updatedItem?.id,
        lastUpdateDate: updatedItem?.lastUpdateDate,
      });
    } catch (e: any) {
      if (e instanceof ConditionalCheckFailedException) {
        throw new NotFoundError();
      }
      throw new UnknownError({ detail: e.message });
    }
  }

  async delete(transaction: Transaction): Promise<void> {
    try {
      const request = TransactionsMapper.marshalTransaction({
        ...transaction,
        lastUpdateDate: this.getTimestamp(),
        status: TransactionStatus.DELETED,
      });

      const updateExpression = this.getUpdateExpression(request, [
        "status",
        "lastUpdateDate",
      ]);

      await this.props.dynamoDbClient.send(
        new UpdateCommand({
          TableName: this.props.config.transactionsTable,
          Key: {
            userId: request.userId,
            id: request.id,
          },
          ConditionExpression: "attribute_exists(id) AND status = ACTIVE",
          ...updateExpression,
        }),
      );
    } catch (e: any) {
      if (e instanceof ConditionalCheckFailedException) {
        throw new NotFoundError();
      }
      throw new UnknownError({ detail: e.message });
    }
  }
}
