import type { FieldErrors } from "@/shared/api/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getFallbackMessage(status?: number) {
  return status ? `Request failed with status ${status}` : "Request failed";
}

export class ApiError extends Error {
  status?: number;
  code?: string;
  fieldErrors?: FieldErrors;
  details?: unknown;

  constructor(
    message: string,
    options: {
      status?: number;
      code?: string;
      fieldErrors?: FieldErrors;
      details?: unknown;
    } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.fieldErrors = options.fieldErrors;
    this.details = options.details;
  }

  static fromResponse(status: number, body: unknown) {
    if (!isRecord(body)) {
      return new ApiError(getFallbackMessage(status), { status, details: body });
    }

    const message = typeof body.message === "string" ? body.message : getFallbackMessage(status);
    const code = typeof body.code === "string" ? body.code : undefined;
    const fieldErrors = isRecord(body.fieldErrors)
      ? Object.fromEntries(
          Object.entries(body.fieldErrors).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
        )
      : undefined;

    return new ApiError(message, {
      status: typeof body.status === "number" ? body.status : status,
      code,
      fieldErrors,
      details: body,
    });
  }
}
