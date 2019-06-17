import { Collection, FilterQuery, FindOneOptions, ObjectId } from "mongodb";
import db from "../manager";

class UserService {
  private Users: Collection | undefined;

  public async load() {
    this.Users = await db.getCollection("users");
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
   * @param users
   */
  public async insertUsers(users: any[]) {
    return this.Users!.insertMany(users);
  }

  /**
   *
   * @param _id
   * @param user
   */
  public async updateUser(_id: ObjectId, user: any) {}

  /**
   *
   * @param users
   */
  public async updateUsers(users: any[]) {}

  /**
   *
   * @param _id
   */
  public async deleteUser(_id: ObjectId) {}

  /**
   *
   * @param users
   */
  public async deleteUsers(users: any[]) {}
}

export default new UserService();
