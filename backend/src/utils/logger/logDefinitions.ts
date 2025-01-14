export interface LogCodeDefinition {
  code: string;
  level: string;
  message: string;
  description?: string;
}

export const LOG_CODE_LIBRARY: Record<string, LogCodeDefinition> = {
  INFO_API_START: {
    code: "O001",
    level: "info",
    message: "Otisak API server started successfully.",
    description: "The server has started and is ready to accept requests.",
  },
  INFO_SWAGGER_START: {
    code: "O002",
    level: "info",
    message: "Swagger API server started successfully.",
    description:
      "The Swagger server has started and is ready to accept requests.",
  },
  ERROR_UNAUTHORIZED: {
    code: "O003",
    level: "error",
    message: "Unauthorized access blocked.",
    description:
      "A user tried to access a protected route without proper authorization.",
  },
  WARN_INVALID_REQUEST: {
    code: "O004",
    level: "warn",
    message: "Invalid request received.",
    description:
      "A request was received that was missing required parameters or was otherwise invalid.",
  },
};
