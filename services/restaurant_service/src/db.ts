import {
  Collection,
  FilterQuery,
  FindOneOptions,
  MongoClient,
  ObjectId
} from "mongodb";
import logger from "./logger";
import { Restaurant } from "./models/Restaurant";

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

  private Restaurants: Collection | undefined;

  public async connect(config: DatabaseConfig) {
    const { auth, database, host, port } = config;
    logger.info(`Connect to mongodb://${host}:${port}/${database}`);
    this.client = await MongoClient.connect(`mongodb://${host}:${port}`, {
      auth,
      useNewUrlParser: true
    });
    this.Restaurants = this.client.db(database).collection("restaurants");
  }

  public async disconnect() {
    if (this.client) {
      await this.client.close();
    }
  }

  public async findRestaurants(
    query: FilterQuery<any>,
    options?: FindOneOptions
  ): Promise<Restaurant[]> {
    return this.Restaurants!.find<Restaurant>(query, options).toArray();
  }

  public async findRestaurant(_id: ObjectId): Promise<Restaurant | null> {
    return this.Restaurants!.findOne<Restaurant>({ _id });
  }

  public async insertRestaurant(restaurant: any) {
    return this.Restaurants!.insertOne(restaurant);
  }

  public async updateRestaurant(_id: ObjectId, update: any) {
    return this.Restaurants!.updateOne({ _id }, { $set: update });
  }

  public async deleteRestaurant(_id: ObjectId) {
    return this.Restaurants!.deleteOne({ _id });
  }
}

export default new DatabaseManager();
