export type RetrieveEventData = {
  title: string;
  message: string;
  fields: Array<{ name: string; value: string }>;
  metadata: Record<string, unknown>;
  errorMessage: null;
  retryCount: number;
  status: string;
  createdAt: string;
};

export type ClientConfig = {
  apiKey: string;
};

export type SendOptions = {
  title: string;
  color: string;
  fields: Array<{ name: string; value: string }>;
  metadata: Record<string, unknown>;
};

export type SendResult = {
  success: boolean;
  eventId: string;
  error?: string;
};
