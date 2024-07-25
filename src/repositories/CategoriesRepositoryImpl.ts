import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Category } from "../domains/Category";
import { AbstractDynamoDbRepository } from "./AbstractDynamoDbRepository";
import { CategoriesRepository } from "./CategoriesRepository";
import { UnknownError } from "../errors/UnknownError";
import { CategoriesMapper } from "../mappers/CategoriesMapper";

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
}
