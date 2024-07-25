import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Category } from "../domains/Category";
import { AbstractDynamoDbRepository } from "./AbstractDynamoDbRepository";
import { CategoriesRepository } from "./CategoriesRepository";
import { UnknownError } from "../errors/UnknownError";
import { CategoriesMapper } from "../mappers/CategoriesMapper";
import { NotFoundError } from "../errors/NotFoundError";
import { GlobalError } from "../errors/GlobalError";
import { CategoryStatus } from "../types/Category";

export interface CategoriesRepositoryProps {
  dynamoDbClient: DynamoDBDocumentClient;
  config: {
    categoriesTable?: string;
  };
}

export class CategoriesRepositoryImpl
  extends AbstractDynamoDbRepository
  implements CategoriesRepository
{
  constructor(private props: CategoriesRepositoryProps) {
    super();
  }

  async create(category: Category): Promise<Category> {
    try {
      const request = CategoriesMapper.marshalCategory({
        ...category,
        id: this.getUUID(),
        creationDate: this.getTimestamp(),
      });

      const { Attributes: newItem } = await this.props.dynamoDbClient.send(
        new PutCommand({
          Item: request,
          TableName: this.props.config.categoriesTable,
          ReturnValues: "ALL_NEW",
        }),
      );

      return new Category({
        id: newItem?.id,
        creationDate: newItem?.creationDate,
      });
    } catch (e: any) {
      throw new UnknownError({ detail: e.message });
    }
  }

  async findByUserId(userId: string): Promise<Category[]> {
    try {
      const { Items: items } = await this.props.dynamoDbClient.send(
        new QueryCommand({
          TableName: this.props.config.categoriesTable,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: { ":userId": userId },
        }),
      );

      if (items) {
        return items.reduce((prev: Category[], curr) => {
          if (curr.status === CategoryStatus.DELETED) return prev;
          return [...prev, CategoriesMapper.unmarshalCategory(curr)];
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
}
