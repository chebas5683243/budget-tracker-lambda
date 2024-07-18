import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { SettingsRepository } from "./SettingsRepository";
import { Setting } from "../domains/Setting";
import { UnknownError } from "../errors/UnknownError";
import { SettingsMapper } from "../mappers/SettingMapper";
import { NotFoundError } from "../errors/NotFoundError";

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
}
