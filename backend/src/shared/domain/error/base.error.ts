export abstract class BaseError extends Error {
  readonly kind: string;
  readonly details?: unknown;

  constructor(message: string, kind: string, details?: unknown) {
    super(message);
    this.kind = kind;
    this.details = details;
  }
}
