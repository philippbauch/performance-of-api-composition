import util from "util";
import { User } from "../models/User";
import client from "./user.agent";

export interface QueryParams {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export function getUsers(params: QueryParams): Promise<User[]> {
  const getUsersPromisified = util.promisify(client.getUsers);
  return getUsersPromisified.call(client, params)
    .then(({ users }: any) => {
      return users;
    })
    .catch((error: any) => {
      throw error;
    });
}

export function getUser(_id: string): Promise<User> {
  const getUserPromisified = util.promisify(client.getUser);
  return getUserPromisified.call(client, { _id })
    .then(({ user }: any) => {
      return user;
    })
    .catch((error: any) => {
      throw error;
    });
}
