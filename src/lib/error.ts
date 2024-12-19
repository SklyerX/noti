export enum OAuthErrorCode {
  EMAIL_EXISTS = "EMAIL_EXISTS",
  GITHUB_EMAIL_MISSING = "GITHUB_EMAIL_MISSING",
}

export interface OAuthError {
  code: OAuthErrorCode;
  message: string;
  statusCode: number;
}

export const OAuthErrors: Record<OAuthErrorCode, OAuthError> = {
  [OAuthErrorCode.EMAIL_EXISTS]: {
    code: OAuthErrorCode.EMAIL_EXISTS,
    message: "An account with this email already exists",
    statusCode: 409,
  },
  [OAuthErrorCode.GITHUB_EMAIL_MISSING]: {
    code: OAuthErrorCode.GITHUB_EMAIL_MISSING,
    message: "No email address found in GitHub profile",
    statusCode: 400,
  },
};

export function createOAuthErrorResponse(code: OAuthErrorCode): Response {
  const error = OAuthErrors[code];
  const searchParams = new URLSearchParams({
    code: error.code,
    message: error.message,
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: `/error?${searchParams.toString()}`,
    },
  });
}
