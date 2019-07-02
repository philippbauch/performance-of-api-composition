import { handleUnaryCall, sendUnaryData, ServerUnaryCall } from "grpc";
import { ObjectId } from "mongodb";
import db from "../db";
import { Restaurant } from "../models/Restaurant";

interface GetRestaurantsRequest {
  name?: string;
}

interface GetRestaurantsResponse {
  restaurants: Restaurant[];
}

export const getRestaurants: handleUnaryCall<
  GetRestaurantsRequest,
  GetRestaurantsResponse
> = async (
  call: ServerUnaryCall<GetRestaurantsRequest>,
  callback: sendUnaryData<GetRestaurantsResponse>
) => {
  const { name } = call.request;
  try {
    const restaurants = await db.findRestaurants({ name });
    callback(null, { restaurants });
  } catch (error) {
    callback(error, null);
  }
};

interface GetRestaurantRequest {
  _id: string;
}

interface GetRestaurantResponse {
  restaurant: Restaurant;
}

export const getRestaurant: handleUnaryCall<GetRestaurantRequest, GetRestaurantResponse> = async (
  call: ServerUnaryCall<GetRestaurantRequest>,
  callback: sendUnaryData<GetRestaurantResponse>
) => {
  const { _id: restaurantId } = call.request;
  if (restaurantId.length !== 24 || !ObjectId.isValid(restaurantId)) {
    callback(new Error(`Invalid ObjectId: ${restaurantId}`), null);
  } else {
    const _restaurantId = ObjectId.createFromHexString(restaurantId);
    try {
      const restaurant = await db.findRestaurant(_restaurantId);
      if (restaurant) {
        callback(null, { restaurant });
      } else {
        callback(new Error("Restaurant does not exist"), null);
      }
    } catch (error) {
      callback(error, null);
    }
  }
};
