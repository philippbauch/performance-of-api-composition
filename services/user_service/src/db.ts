import {
  Collection,
  FilterQuery,
  FindOneOptions,
  MongoClient,
  ObjectId
} from "mongodb";
import logger from "./logger";
import { User } from "./models/User";

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

  private Users: Collection | undefined;

  public async connect(config: DatabaseConfig) {
    const { auth, database, host, port } = config;
    logger.info(`Connect to mongodb://${host}:${port}/${database}`);
    this.client = await MongoClient.connect(`mongodb://${host}:${port}`, {
      auth,
      useNewUrlParser: true
    });
    this.Users = this.client.db(database).collection("users");
  }

  public async disconnect() {
    if (this.client) {
      await this.client.close();
    }
  }

  public async findUsers(
    query: FilterQuery<any>,
    options?: FindOneOptions
  ): Promise<User[]> {
    return this.Users!.find<User>(query, options).toArray();
  }

  public async findUser(_id: ObjectId): Promise<User | null> {
    return this.Users!.findOne<User>({ _id });
  }

  public async insertUser(user: any) {
    return this.Users!.insertOne(user);
  }

  public async updateUser(_id: ObjectId, update: any) {
    return this.Users!.updateOne({ _id }, { $set: update });
  }

  public async deleteUser(_id: ObjectId) {
    return this.Users!.deleteOne({ _id });
  }
}

export default new DatabaseManager();
