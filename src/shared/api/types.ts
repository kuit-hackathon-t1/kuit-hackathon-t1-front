export type FieldErrors = Record<string, string>;

export type ApiErrorResponse = {
  code: string;
  message: string;
  status: number;
  fieldErrors?: FieldErrors;
};

export type RequestOptions = Omit<RequestInit, "body" | "credentials" | "method"> & {
  body?: unknown;
  credentials?: boolean | RequestCredentials;
  userId?: number;
};
