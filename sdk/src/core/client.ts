import axios, { type AxiosError, type AxiosInstance } from "axios";
import type {
  ClientConfig,
  RetrieveEventData,
  SendOptions,
  SendResult,
} from "./types";
import { SDKError } from "../errors";

export class Client {
  private readonly axios: AxiosInstance;
  private readonly baseURL = "https://noti.skylerx.ir/api";
  private readonly timeout = 10000;
  private apiKey: string;

  constructor({ apiKey }: ClientConfig) {
    this.apiKey = apiKey;

    this.axios = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        "x-api-key": this.apiKey,
        "Content-Type": "application/json",
      },
    });
  }

  async retrieve(eventId: string): Promise<RetrieveEventData> {
    try {
      const { data } = await this.axios.get(
        `/notification/retrieve/${eventId}`
      );
      return data;
    } catch (err) {
      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError;
        throw new SDKError(
          axiosError.message || "Failed to retrieve notification",
          "RETRIEVE_ERROR"
        );
      }

      throw err;
    }
  }

  async send(options: SendOptions): Promise<SendResult> {
    try {
      const response = await this.axios.post("/notification/send", options);
      return response.data;
    } catch (err) {
      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError;
        throw new SDKError(
          axiosError.message || "Failed to send notification",
          "SEND_ERROR"
        );
      }

      throw err;
    }
  }

  template(content: SendOptions) {
    const sender = async (data: Record<string, string>) => {
      const preparedMetadata = Object.entries(content.metadata).reduce(
        (acc, [key, value]) => {
          acc[key] =
            typeof value === "string" ? this.interpolate(value, data) : value;
          return acc;
        },
        {} as Record<string, string | unknown>
      );

      const preparedContent = {
        title: this.interpolate(content.title, data),
        color: String(content.color),
        fields: content.fields.map((field) => ({
          name: this.interpolate(field.name, data),
          value: this.interpolate(field.value, data),
        })),
        metadata: preparedMetadata,
      };

      return await this.send(preparedContent);
    };

    return sender;
  }

  private interpolate(
    template: string,
    values: Record<string, string>
  ): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return values[key] || match;
    });
  }
}
