export interface LogCodeDefinition {
  code: string;
  level: string;
  message: string;
  description?: string;
}

export const LOG_CODE_LIBRARY: Record<string, LogCodeDefinition> = {
  INFO_API_START: {
    code: "S001",
    level: "info",
    message: "SAT API server started successfully.",
    description: "The server has started and is ready to accept requests.",
  },
  INFO_SWAGGER_START: {
    code: "S002",
    level: "info",
    message: "Swagger API server started successfully.",
    description:
      "The Swagger server has started and is ready to accept requests.",
  },
  ERROR_UNAUTHORIZED: {
    code: "S003",
    level: "error",
    message: "Unauthorized access blocked.",
    description:
      "A user tried to access a protected route without proper authorization.",
  },
  WARN_INVALID_REQUEST: {
    code: "S004",
    level: "warn",
    message: "Invalid request received.",
    description:
      "A request was received that was missing required parameters or was otherwise invalid.",
  },
};
