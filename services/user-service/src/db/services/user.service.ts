import { Collection, FilterQuery, FindOneOptions } from "mongodb";
import db from "../manager";

class UserService {
  private Users: Collection | undefined;

  public async load() {
    this.Users = await db.getCollection("users");
  }

  public async getUsers(
    query: FilterQuery<any>,
    options?: FindOneOptions
  ): Promise<any[]> {
    return this.Users!.find(query, options).toArray();
  }
}

export default new UserService();
