import { verifyToken } from "@clerk/backend";
import { ApiUser } from "../domains/ApiUser";
import { SecurityService } from "./SecurityService";
import { logger } from "../logging";
import { UnknownError } from "../errors/UnknownError";

export interface SecurityServiceProps {
  config: {
    clerkPublickKey?: string;
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
    const verifiedToken = await verifyToken(token, {
      jwtKey: this.props.config.clerkPublickKey,
      authorizedParties: ["http://localhost:3000"],
    });

    logger.info("sub", verifiedToken.sub);

    return new ApiUser();
  }
}
