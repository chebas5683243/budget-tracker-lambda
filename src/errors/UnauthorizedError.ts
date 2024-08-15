import { GlobalError } from "./GlobalError";

export class UnauthorizedError extends GlobalError {
  constructor(props?: { code?: string; message?: string; detail?: string }) {
    super(
      props?.code || "0.6.0",
      props?.message || "Unauthorized",
      401,
      props?.detail,
    );
  }
}
