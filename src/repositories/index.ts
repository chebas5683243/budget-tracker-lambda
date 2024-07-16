import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SettingsRepositoryImpl } from "./SettingsRepositoryImpl";
import { SETTINGS_TABLE } from "../config";

const dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

export const settingsRepo = new SettingsRepositoryImpl({
  dynamoDbClient,
  config: {
    settingsTable: SETTINGS_TABLE,
  },
});
