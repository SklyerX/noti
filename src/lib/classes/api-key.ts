import crypto from "node:crypto";

export class ApiKeyManager {
  private API_KEY_LENGTH = 32;
  private TEST_PREFIX = "sk_test_";
  private LIVE_PREFIX = "sk_live_";

  public generateKey(isLive: boolean) {
    const randomBytes = crypto.randomBytes(this.API_KEY_LENGTH);
    const randomPart = randomBytes.toString("hex");

    const prefix = isLive ? this.LIVE_PREFIX : this.TEST_PREFIX;
    const apiKey = `${prefix}_${randomPart}`;

    const hashedKey = this.hashAPIKey(apiKey);

    return {
      apiKey,
      hashedKey,
    };
  }

  hashAPIKey(key: string): string {
    return crypto.createHash("sha256").update(key).digest("hex");
  }

  public verifyAPIKey(providedKey: string, storedHash: string): boolean {
    const hashedProvidedKey = this.hashAPIKey(providedKey);

    try {
      return crypto.timingSafeEqual(
        Buffer.from(hashedProvidedKey, "hex"),
        Buffer.from(storedHash, "hex")
      );
    } catch {
      return false;
    }
  }
}
