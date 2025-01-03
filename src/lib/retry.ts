interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffFactor?: number;
}

interface RetryResult<T> {
  success: boolean;
  result?: T;
  error?: Error;
  attempts: number;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<RetryResult<T>> {
  const { maxAttempts = 3, delayMs = 1000, backoffFactor = 2 } = options;

  let attempts = 0;
  let lastError: Error | undefined;

  while (attempts < maxAttempts) {
    try {
      console.log("Attempt:", attempts);
      attempts++;
      const result = await operation();
      return {
        success: true,
        result,
        attempts,
      };
    } catch (error) {
      lastError = error as Error;

      if (attempts === maxAttempts) break;

      // Wait before the next retry with exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, delayMs * backoffFactor ** (attempts - 1)),
      );
    }
  }

  return {
    success: false,
    error: lastError,
    attempts,
  };
}
