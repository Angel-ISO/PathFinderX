import { createClient } from "redis";

class CacheClient {
  constructor() {
    this.client = createClient({
      url: process.env.UPSTASH_REDIS_URL,
      socket: {
        tls: true,
        rejectUnauthorized: false,
        connectTimeout: 20000,
      }
    });

    this.client.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
      console.log("Connected to Cache db");
    }
  }

  async set(key, value, ttl = 3600) {
    await this.client.set(key, JSON.stringify(value), { EX: ttl });
  }

  async get(key) {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async del(key) {
    await this.client.del(key);
  }
}

const cacheClient = new CacheClient();

cacheClient.connect().catch((err) => {
  console.error("Failed to connect to Cache Db:", err);
});

export default cacheClient;