import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { SettingsRepository } from "./SettingsRepository";
import { Setting } from "../domains/Setting";
import { UnknownError } from "../errors/UnknownError";
import { SettingsMapper } from "../mappers/SettingMapper";
import { NotFoundError } from "../errors/NotFoundError";
import { AbstractDynamoDbRepository } from "./AbstractDynamoDbRepository";

interface SettingsRepositoryProps {
  dynamoDbClient: DynamoDBDocumentClient;
  config: {
    settingsTable?: string;
  };
}

export class SettingsRepositoryImpl
  extends AbstractDynamoDbRepository
  implements SettingsRepository
{
  constructor(private props: SettingsRepositoryProps) {
    super();

    if (!this.props.config.settingsTable) {
      throw new UnknownError({
        detail: "Missing Settings Table env variable",
      });
    }
  }

  async findByUserId(userId: string): Promise<Setting> {
    let error;
    try {
      const { Item } = await this.props.dynamoDbClient.send(
        new GetCommand({
          TableName: this.props.config.settingsTable,
          Key: {
            userId,
          },
        }),
      );

      if (Item) return SettingsMapper.unmarshalSetting(Item);
      error = new NotFoundError();
    } catch (e: any) {
      throw new UnknownError({ detail: e.message });
    }
    throw error || new UnknownError();
  }

  async update(setting: Setting): Promise<Setting> {
    try {
      const request = new Setting({
        ...setting,
        lastUpdateDate: this.getTimestamp(),
      });

      const updateExpression = this.getUpdateExpression(request, [
        "currency",
        "language",
        "themePreference",
        "lastUpdateDate",
      ]);

      const { Attributes } = await this.props.dynamoDbClient.send(
        new UpdateCommand({
          TableName: this.props.config.settingsTable,
          Key: {
            userId: setting.user.id,
          },
          ...updateExpression,
          ReturnValues: "ALL_NEW",
        }),
      );

      return new Setting({
        id: Attributes?.id,
        lastUpdateDate: Attributes?.lastUpdateDate,
      });
    } catch (e: any) {
      if (e instanceof ConditionalCheckFailedException) {
        throw new NotFoundError();
      }
      throw new UnknownError({ detail: e.message });
    }
  }
}
