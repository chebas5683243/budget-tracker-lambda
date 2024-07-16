import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { SettingsRepository } from "./SettingsRepository";
import { Setting } from "../domains/Setting";
import { UnknownError } from "../errors/UnknownError";
import { SettingsMapper } from "../mappers/SettingMapper";

interface SettingsRepositoryProps {
  dynamoDbClient: DynamoDBDocumentClient;
  config: {
    settingsTable?: string;
  };
}

export class SettingsRepositoryImpl implements SettingsRepository {
  constructor(private props: SettingsRepositoryProps) {
    if (!this.props.config.settingsTable) {
      throw new UnknownError({
        detail: "Missing Settings Table env variable",
      });
    }
  }

  async findByUserId(userId: string): Promise<Setting[]> {
    try {
      const { Items: items } = await this.props.dynamoDbClient.send(
        new QueryCommand({
          TableName: this.props.config.settingsTable,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId,
          },
        }),
      );

      if (!items) return [];

      return items.map((item) => SettingsMapper.unmarshalSetting(item));
    } catch (e: any) {
      throw new UnknownError({ detail: e.message });
    }
  }
}
