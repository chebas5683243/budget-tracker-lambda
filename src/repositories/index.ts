import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SettingsRepositoryImpl } from "./SettingsRepositoryImpl";
import { CATEGORIES_TABLE, SETTINGS_TABLE } from "../config";
import { CategoriesRepositoryImpl } from "./CategoriesRepositoryImpl";

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

export const categoriesRepo = new CategoriesRepositoryImpl({
  dynamoDbClient,
  config: {
    categoriesTable: CATEGORIES_TABLE,
  },
});
