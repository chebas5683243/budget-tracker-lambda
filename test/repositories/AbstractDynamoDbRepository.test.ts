import { AbstractDynamoDbRepository } from "../../src/repositories/AbstractDynamoDbRepository";

class DynamoDbRepository extends AbstractDynamoDbRepository {
  getUpdateExpressionWrapper<T extends object>(
    domain: T,
    attributes: (keyof T)[],
  ) {
    return this.getUpdateExpression(domain, attributes);
  }
}

describe("AbstractDynamoDbRepository", () => {
  describe("getUpdateExpression", () => {
    it("should return a valid update expression", () => {
      // Arrange
      const repository = new DynamoDbRepository();

      const domain = {
        a: "a",
        b: "b",
        c: "c",
      };

      // Act
      const response = repository.getUpdateExpressionWrapper(domain, [
        "a",
        "b",
      ]);

      // Assert
      expect(response).toEqual({
        UpdateExpression: "SET #a = :a, #b = :b",
        ExpressionAttributeNames: {
          "#a": "a",
          "#b": "b",
        },
        ExpressionAttributeValues: {
          ":a": "a",
          ":b": "b",
        },
      });
    });
  });
});
