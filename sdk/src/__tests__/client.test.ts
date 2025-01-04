import { Client } from "../core/client";
import { SDKError } from "../errors";
import axios from "axios";

jest.mock("axios");

describe("Client", () => {
  let client: Client;
  let mockAxiosInstance: { get: jest.Mock; post: jest.Mock };

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
    };

    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
    client = new Client({ apiKey: "test-key" });
  });

  describe("retrieve", () => {
    it("should successfully retrieve event data", async () => {
      const mockResponse = {
        data: {
          eventId: "event-123",
          success: true,
          status: "success",
        },
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const result = await client.retrieve("event-123");
      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        "/notification/retrieve/event-123"
      );
    });

    it("should throw SDKError on API error", async () => {
      const error = new Error();
      Object.assign(error, {
        isAxiosError: true,
        response: {
          data: {
            message: "Event not found",
            status: "error",
          },
        },
      });

      mockAxiosInstance.get.mockRejectedValueOnce(error);
      await expect(client.retrieve("event-123")).rejects.toThrow(SDKError);
    });
  });

  describe("send", () => {
    const mockSendOptions = {
      title: "Test Notification",
      color: "0x00ff00",
      fields: [{ name: "Field 1", value: "Value 1" }],
      metadata: {
        type: "test",
      },
    };

    it("should successfully send notification", async () => {
      const mockResponse = {
        data: {
          eventId: "notification-123",
          success: true,
          status: "success",
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await client.send(mockSendOptions);
      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/notification/send",
        mockSendOptions
      );
    });

    it("should throw SDKError on send failure", async () => {
      const error = new Error();
      Object.assign(error, {
        isAxiosError: true,
        response: {
          data: {
            message: "Invalid notification data",
            status: "error",
          },
        },
      });

      mockAxiosInstance.post.mockRejectedValueOnce(error);
      await expect(client.send(mockSendOptions)).rejects.toThrow(SDKError);
    });
  });

  describe("template", () => {
    it("should correctly interpolate template values", async () => {
      const mockResponse = {
        data: {
          eventId: "notification-123",
          success: true,
          status: "success",
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const template = client.template({
        title: "Hello {{name}}",
        color: "0x00ff00",
        fields: [{ name: "User", value: "{{username}}" }],
        metadata: {
          type: "greeting",
          customField: "{{custom}}",
        },
      });

      await template({
        name: "John",
        username: "johndoe",
        custom: "value",
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/notification/send",
        expect.objectContaining({
          title: "Hello John",
          color: "0x00ff00",
          fields: [{ name: "User", value: "johndoe" }],
          metadata: { type: "greeting", customField: "value" },
        })
      );
    });

    it("should keep placeholders when data is missing", async () => {
      const mockResponse = {
        data: {
          eventId: "notification-123",
          success: true,
          status: "success",
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const template = client.template({
        title: "Hello {{name}}",
        color: "0x00ff00",
        fields: [{ name: "User", value: "{{username}}" }],
        metadata: {
          type: "greeting",
          customField: "{{custom}}",
        },
      });

      await template({
        name: "John",
        // username and custom are intentionally missing
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/notification/send",
        expect.objectContaining({
          title: "Hello John",
          fields: [{ name: "User", value: "{{username}}" }],
          metadata: { type: "greeting", customField: "{{custom}}" },
        })
      );
    });
  });
});
