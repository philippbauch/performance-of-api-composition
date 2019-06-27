import {
  Collection,
  FilterQuery,
  FindOneOptions,
  MongoClient,
  ObjectId
} from "mongodb";
import logger from "./logger";
import { Reservation } from "./models/Reservation";

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

  private Reservations: Collection | undefined;

  public async connect(config: DatabaseConfig) {
    const { auth, database, host, port } = config;
    logger.info(`Connect to mongodb://${host}:${port}/${database}`);
    this.client = await MongoClient.connect(`mongodb://${host}:${port}`, {
      auth,
      useNewUrlParser: true
    });
    this.Reservations = this.client.db(database).collection("reservations");
  }

  public async disconnect() {
    if (this.client) {
      await this.client.close();
    }
  }

  public async findReservations(
    query: FilterQuery<any>,
    options?: FindOneOptions
  ): Promise<Reservation[]> {
    return this.Reservations!.find<Reservation>(query, options).toArray();
  }

  public async findReservation(_id: ObjectId): Promise<Reservation | null> {
    return this.Reservations!.findOne<Reservation>({ _id });
  }

  public async insertReservation(reservation: any) {
    return this.Reservations!.insertOne(reservation);
  }

  public async updateReservation(_id: ObjectId, update: any) {
    return this.Reservations!.updateOne({ _id }, { $set: update });
  }

  public async deleteReservation(_id: ObjectId) {
    return this.Reservations!.deleteOne({ _id });
  }
}

export default new DatabaseManager();
