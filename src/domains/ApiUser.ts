import * as lambda from "aws-lambda";
import { PolicyDocument } from "aws-lambda";

export class ApiUser {
  userId: string;

  apis: string[];

  constructor(data?: Partial<ApiUser>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  setApis(apis: string[]) {
    this.apis = [...new Set(apis)];
  }

  private getBaseResource(methodArn: string) {
    const items = methodArn.split(":");
    const apiGatewayId = items[5].split("/");
    return `${items[0]}:${items[1]}:${items[2]}:${items[3]}:${items[4]}:${apiGatewayId[0]}`;
  }

  private getPolicyDocument(methodArn: string): PolicyDocument {
    return {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: this.apis?.map(
            (r) => `${this.getBaseResource(methodArn)}${r}`,
          ),
        },
      ],
    };
  }

  getAPIGatewayAuthorizerResult(
    methodArn: string,
  ): lambda.APIGatewayAuthorizerResult {
    return {
      principalId: this.userId,
      context: {
        customerId: this.userId,
      },
      policyDocument: this.getPolicyDocument(methodArn),
    };
  }
}
