import { randomUUID } from "node:crypto";

export abstract class AbstractDynamoDbRepository {
  protected getUUID(): string {
    return randomUUID();
  }

  protected getTimestamp() {
    return Date.now();
  }

  protected getUpdateExpression<T extends object>(
    domain: T,
    attributes: (keyof T)[],
  ) {
    const attrToUpdate = attributes.filter(
      (key) => domain[key as keyof T] !== undefined,
    );

    if (attrToUpdate.length === 0) {
      return undefined;
    }

    return attrToUpdate.reduce(
      (prev, curr, index) => {
        const key = String(curr);
        return {
          UpdateExpression: `${prev.UpdateExpression}${
            index === 0 ? "" : ","
          } #${key} = :${key}`,
          ExpressionAttributeNames: {
            ...prev.ExpressionAttributeNames,
            [`#${key}`]: curr,
          },
          ExpressionAttributeValues: {
            ...prev.ExpressionAttributeValues,
            [`:${key}`]: domain[curr],
          },
        };
      },
      {
        UpdateExpression: "SET",
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {},
      },
    );
  }
}
