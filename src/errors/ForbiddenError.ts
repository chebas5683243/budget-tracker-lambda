import { GlobalError } from "./GlobalError";

export class ForbiddenError extends GlobalError {
  constructor(props?: { code?: string; message?: string; detail?: string }) {
    super(
      props?.code || "0.5.0",
      props?.message || "Forbidden",
      403,
      props?.detail,
    );
  }
}
