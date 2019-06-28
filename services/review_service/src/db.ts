import {
  Collection,
  FilterQuery,
  FindOneOptions,
  MongoClient,
  ObjectId
} from "mongodb";
import logger from "./logger";
import { Review } from "./models/Review";

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

  private Reviews: Collection | undefined;

  public async connect(config: DatabaseConfig) {
    const { auth, database, host, port } = config;
    logger.info(`Connect to mongodb://${host}:${port}/${database}`);
    this.client = await MongoClient.connect(`mongodb://${host}:${port}`, {
      auth,
      useNewUrlParser: true
    });
    this.Reviews = this.client.db(database).collection("reviews");
  }

  public async disconnect() {
    if (this.client) {
      await this.client.close();
    }
  }

  public async findReviews(
    query: FilterQuery<any>,
    options?: FindOneOptions
  ): Promise<Review[]> {
    return this.Reviews!.find<Review>(query, options).toArray();
  }

  public async findReview(_id: ObjectId): Promise<Review | null> {
    return this.Reviews!.findOne<Review>({ _id });
  }

  public async insertReview(review: any) {
    return this.Reviews!.insertOne(review);
  }

  public async updateReview(_id: ObjectId, update: any) {
    return this.Reviews!.updateOne({ _id }, { $set: update });
  }

  public async deleteReview(_id: ObjectId) {
    return this.Reviews!.deleteOne({ _id });
  }
}

export default new DatabaseManager();
