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
    const separator = "/prod";
    const [apiGatewayId] = methodArn.split(separator);
    return `${apiGatewayId}/prod`;
  }

  private getPolicyDocument(methodArn: string): PolicyDocument {
    return {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: this.apis?.map(
            (api) => `${this.getBaseResource(methodArn)}${api}`,
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
        userId: this.userId,
      },
      policyDocument: this.getPolicyDocument(methodArn),
    };
  }
}
