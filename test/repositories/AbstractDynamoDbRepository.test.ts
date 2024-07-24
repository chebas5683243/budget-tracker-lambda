import { AbstractDynamoDbRepository } from "../../src/repositories/AbstractDynamoDbRepository";

class DynamoDbRepository extends AbstractDynamoDbRepository {}

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
      const response = repository.getUpdateExpression(domain, ["a", "b"]);

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
