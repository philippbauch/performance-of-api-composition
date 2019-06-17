import { Db, MongoClient } from "mongodb";
import { logger } from "../utils/logger";

export interface DatabaseConfig {
  auth?: {
    user: string;
    password: string;
  };
  database: string;
  host: string;
  port: number;
}

class DatabaseManager {
  private client: MongoClient | undefined;

  private db: Db | undefined;

  public async connect(config: DatabaseConfig) {
    const { auth, database, host, port } = config;
    logger.info(`Connect to mongodb://${host}:${port}/${database}`);
    this.client = await MongoClient.connect(`mongodb://${host}:${port}`, {
      auth,
      useNewUrlParser: true
    });
    this.db = this.client.db(database);
  }

  public async disconnect() {
    if (this.client) {
      await this.client.close();
    }
  }

  public async getCollection(name: string) {
    if (!this.db) {
      throw new Error(
        "Trying to access collection without database connection!"
      );
    }
    return this.db.collection(name);
  }
}

export default new DatabaseManager();
