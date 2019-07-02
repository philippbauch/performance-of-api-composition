import util from "util";
import { Restaurant } from "../models/Restaurant";
import client from "./restaurant.agent";

export interface QueryParams {
  name?: string;
}

export async function getRestaurants(params: QueryParams): Promise<Restaurant[]> {
  const getRestaurantsPromisified = util.promisify(client.getRestaurants);
  return getRestaurantsPromisified.call(client, params)
    .then(({ restaurants }: any) => {
      return restaurants;
    })
    .catch((error: any) => {
      throw error;
    });
}


export function getRestaurant(_id: string): Promise<Restaurant> {
  const getRestaurantPromisified = util.promisify(client.getRestaurant);
  return getRestaurantPromisified.call(client, { _id })
    .then(({ restaurant }: any) => {
      return restaurant;
    })
    .catch((error: any) => {
      throw error;
    });
}
