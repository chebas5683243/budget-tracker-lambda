import { GlobalError } from "./GlobalError";

export class ConflictError extends GlobalError {
  constructor(props?: { code?: string; message?: string; detail?: string }) {
    super(
      props?.code || "0.2.0",
      props?.message || "Conflict error",
      409,
      props?.detail,
    );
  }
}
