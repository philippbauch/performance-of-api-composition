import {
  Collection,
  FilterQuery,
  FindOneOptions,
  MongoClient,
  ObjectId
} from "mongodb";
import logger from "../utils/logger";

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

  /**
   *
   * @param query
   * @param options
   */
  public async findUsers(query: FilterQuery<any>, options?: FindOneOptions) {
    return this.Users!.find(query, options).toArray();
  }

  /**
   *
   * @param _id
   */
  public async findUser(_id: ObjectId) {
    return this.Users!.findOne({ _id });
  }

  /**
   *
   * @param user
   */
  public async insertUser(user: any) {
    return this.Users!.insertOne(user);
  }

  /**
   *
   * @param _id
   * @param update
   */
  public async updateUser(_id: ObjectId, update: any) {
    return this.Users!.updateOne({ _id }, { $set: update });
  }

  /**
   *
   * @param _id
   */
  public async deleteUser(_id: ObjectId) {
    return this.Users!.deleteOne({ _id });
  }
}

export default new DatabaseManager();
