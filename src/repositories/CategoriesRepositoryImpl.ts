import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
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
        status: CategoryStatus.ACTIVE,
      });

      await this.props.dynamoDbClient.send(
        new PutCommand({
          Item: request,
          TableName: this.props.config.categoriesTable,
          ConditionExpression: "attribute_not_exists(id)",
        }),
      );

      return new Category({
        id: request?.id,
        creationDate: request?.creationDate,
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

  async findById(categoryId: string, userId: string): Promise<Category> {
    try {
      const { Item: item } = await this.props.dynamoDbClient.send(
        new GetCommand({
          TableName: this.props.config.categoriesTable,
          Key: {
            userId,
            id: categoryId,
          },
        }),
      );

      if (item) return CategoriesMapper.unmarshalCategory(item);

      throw new NotFoundError();
    } catch (e: any) {
      if (e instanceof GlobalError) {
        throw e;
      }
      throw new UnknownError({ detail: e.message });
    }
  }

  async update(category: Category): Promise<Category> {
    try {
      const request = CategoriesMapper.marshalCategory({
        ...category,
        lastUpdateDate: this.getTimestamp(),
      });

      const updateExpression = this.getUpdateExpression(request, [
        "name",
        "icon",
        "lastUpdateDate",
      ]);

      const { Attributes: updatedItem } = await this.props.dynamoDbClient.send(
        new UpdateCommand({
          TableName: this.props.config.categoriesTable,
          Key: {
            userId: request.userId,
            id: request.id,
          },
          ConditionExpression: "attribute_exists(id) AND status = 'ACTIVE'",
          ReturnValues: "ALL_NEW",
          ...updateExpression,
        }),
      );

      return new Category({
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

  async delete(category: Category): Promise<void> {
    try {
      const request = CategoriesMapper.marshalCategory({
        ...category,
        lastUpdateDate: this.getTimestamp(),
        status: CategoryStatus.DELETED,
      });

      const updateExpression = this.getUpdateExpression(request, [
        "status",
        "lastUpdateDate",
      ]);

      await this.props.dynamoDbClient.send(
        new UpdateCommand({
          TableName: this.props.config.categoriesTable,
          Key: {
            userId: request.userId,
            id: request.id,
          },
          ConditionExpression: "attribute_exists(id) AND status = 'ACTIVE'",
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
