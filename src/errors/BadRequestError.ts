import { GlobalError } from "./GlobalError";

export class BadRequestError extends GlobalError {
  constructor(props?: { code?: string; message?: string; detail?: string }) {
    super(
      props?.code || "0.1.0",
      props?.message || "Bad request",
      400,
      props?.detail,
    );
  }
}
