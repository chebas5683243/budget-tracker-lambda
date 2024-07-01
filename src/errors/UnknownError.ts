import { GlobalError } from "./GlobalError";

export class UnknownError extends GlobalError {
  constructor(props?: { code?: string; message?: string; detail?: string }) {
    super(
      props?.code || "0.3.0",
      props?.message || "Unknown error",
      500,
      props?.detail,
    );
  }
}
