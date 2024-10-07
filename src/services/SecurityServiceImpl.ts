import { verifyToken } from "@clerk/backend";
import { ApiUser } from "../domains/ApiUser";
import { SecurityService } from "./SecurityService";
import { UnknownError } from "../errors/UnknownError";
import { logger } from "../logging";

export interface SecurityServiceProps {
  config: {
    clerkPublickKey?: string;
    authorizedParties?: string[];
  };
}

export class SecurityServiceImpl implements SecurityService {
  constructor(private props: SecurityServiceProps) {
    if (!this.props.config.clerkPublickKey) {
      throw new UnknownError({
        detail: "Missing Clerk Public Key env variable",
      });
    }
  }

  async authenticateUser(token: string): Promise<ApiUser> {
    logger.debug(
      "Authorized parties",
      this.props.config.authorizedParties?.toString() || "",
    );

    const verifiedToken = await verifyToken(token, {
      jwtKey: this.props.config.clerkPublickKey,
      authorizedParties: ["http://localhost:3000"],
    });

    const user = new ApiUser({
      userId: verifiedToken.sub,
    });

    user.setApis([
      "/GET/",
      "/GET/settings",
      "/PATCH/settings",
      "/GET/categories",
      "/POST/categories",
      "/PATCH/categories/*",
      "/DELETE/categories/*",
      "/GET/transactions",
      "/POST/transactions",
      "/PATCH/transactions/*",
      "/DELETE/transactions/*",
      "/GET/reports/*",
    ]);

    return user;
  }
}
