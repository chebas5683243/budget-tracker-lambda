import jwt from "jsonwebtoken";
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
        detail: "Missing Clerck Public Key env variable",
      });
    }
  }

  async authenticateUser(token: string): Promise<ApiUser> {
    const claims = jwt.verify(
      token,
      this.props.config.clerkPublickKey!,
    ) as jwt.JwtPayload;
    logger.info("claims", claims);
    logger.info("sub", claims.sub || "");

    return new ApiUser();
  }
}
