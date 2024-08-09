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
        detail: "Missing Clerk Public Key env variable",
      });
    }
  }

  async authenticateUser(token: string): Promise<ApiUser> {
    logger.info("pem", this.props.config.clerkPublickKey!);

    const pemKey = Buffer.from(
      this.props.config.clerkPublickKey!,
      "base64",
    ).toString("utf-8");

    logger.info("pemKey", pemKey);

    const claims = jwt.verify(token, pemKey) as jwt.JwtPayload;

    logger.info("claims", claims);
    logger.info("sub", claims.sub || "");

    return new ApiUser();
  }
}
