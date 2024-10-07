import { verifyToken } from "@clerk/backend";
import { ApiUser } from "../domains/ApiUser";
import { SecurityService } from "./SecurityService";
import { UnknownError } from "../errors/UnknownError";
import { logger } from "../logging";

export interface SecurityServiceProps {
  config: {
    clerkPublickKey?: string;
    authorizedParties: string[];
  };
}

export class SecurityServiceImpl implements SecurityService {
  constructor(private props: SecurityServiceProps) {
    if (!this.props.config.clerkPublickKey) {
      throw new UnknownError({
        detail: "Missing Clerk Public Key env variable",
      });
    }

    if (this.props.config.authorizedParties.length === 0) {
      throw new UnknownError({
        detail: "Missing Authorized Parties env variable",
      });
    }
  }

  async authenticateUser(token: string): Promise<ApiUser> {
    logger.info("Authorized parties", {
      authorizedParties: this.props.config.authorizedParties,
    });

    const verifiedToken = await verifyToken(token, {
      jwtKey: this.props.config.clerkPublickKey,
      authorizedParties: this.props.config.authorizedParties,
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
