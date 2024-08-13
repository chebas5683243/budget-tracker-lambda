import * as lambda from "aws-lambda";
import { CategoriesService } from "../services/CategoriesService";
import { BaseController } from "./BaseController";
import { Category } from "../domains/Category";

export interface CategoriesControllerProps {
  categoriesService: CategoriesService;
}

export class CategoriesController extends BaseController {
  constructor(protected props: CategoriesControllerProps) {
    super(props);
  }

  async create(event: lambda.APIGatewayEvent) {
    try {
      const { body, context } = this.parseRequest(event);

      const category = Category.instanceFor("create", {
        user: {
          id: context.userId,
        },
        name: body.name,
        icon: body.icon,
        type: body.type,
      });

      const response = await this.props.categoriesService.create(category);

      return this.apiOk({
        body: response,
        statusCode: 201,
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }

  async findByUserId(event: lambda.APIGatewayEvent) {
    try {
      const { context } = this.parseRequest(event);

      const category = Category.instanceFor("findByUserId", {
        user: {
          id: context.userId,
        },
      });

      const response =
        await this.props.categoriesService.findByUserId(category);

      return this.apiOk({
        body: response,
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }

  async update(event: lambda.APIGatewayEvent) {
    try {
      const { body, context } = this.parseRequest(event);

      const category = Category.instanceFor("update", {
        id: event.pathParameters?.categoryId,
        user: {
          id: context.userId,
        },
        name: body.name,
        icon: body.icon,
        type: body.type,
      });

      const response = await this.props.categoriesService.update(category);

      return this.apiOk({
        body: response,
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }

  async delete(event: lambda.APIGatewayEvent) {
    try {
      const { context } = this.parseRequest(event);

      const category = Category.instanceFor("delete", {
        id: event.pathParameters?.categoryId,
        user: {
          id: context.userId,
        },
      });

      await this.props.categoriesService.delete(category);

      return this.apiOk({
        statusCode: 204,
      });
    } catch (e: any) {
      return this.apiError(e);
    }
  }
}
