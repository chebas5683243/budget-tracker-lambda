import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { AbstractDynamoDbRepository } from "./AbstractDynamoDbRepository";
import { TransactionRepository } from "./TransactionsRepository";
import { Transaction } from "../domains/Transaction";
import { TransactionsMapper } from "../mappers/TransactionsMapper";
import { TransactionStatus } from "../types/Transaction";
import { GlobalError } from "../errors/GlobalError";
import { UnknownError } from "../errors/UnknownError";

export interface TransactionsRepositoryProps {
  dynamoDbClient: DynamoDBDocumentClient;
  config: {
    transactionsTable?: string;
  };
}

export class TransactionsRepositoryImpl
  extends AbstractDynamoDbRepository
  implements TransactionRepository
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
}
