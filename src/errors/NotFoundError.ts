import { GlobalError } from "./GlobalError";

export class NotFoundError extends GlobalError {
  constructor(props?: { code?: string; message?: string; detail?: string }) {
    super(
      props?.code || "0.4.0",
      props?.message || "Not found error",
      404,
      props?.detail,
    );
  }
}
