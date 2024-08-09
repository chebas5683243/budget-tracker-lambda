import { ApiUser } from "../domains/ApiUser";

export interface SecurityService {
  authenticateUser(token: string): Promise<ApiUser>;
}
