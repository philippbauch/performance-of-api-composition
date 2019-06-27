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

interface InsertRestaurantRequest {
  restaurant: Restaurant;
}

interface InsertRestaurantResponse {
  restaurant: Restaurant;
}

export const insertRestaurant: handleUnaryCall<
  InsertRestaurantRequest,
  InsertRestaurantResponse
> = async (
  call: ServerUnaryCall<InsertRestaurantRequest>,
  callback: sendUnaryData<InsertRestaurantResponse>
) => {
  const { restaurant } = call.request;
  delete restaurant._id;
  try {
    const { ops, result } = await db.insertRestaurant(restaurant);
    if (result.ok && ops.length === 1) {
      callback(null, { restaurant: ops[0] });
    } else {
      callback(new Error("Could not insert restaurant"), null);
    }
  } catch (error) {
    callback(error, null);
  }
};

interface UpdateRestaurantRequest {
  _id: string;
  restaurant: Restaurant;
}

interface UpdateRestaurantResponse {}

export const updateRestaurant: handleUnaryCall<
  UpdateRestaurantRequest,
  UpdateRestaurantResponse
> = async (
  call: ServerUnaryCall<UpdateRestaurantRequest>,
  callback: sendUnaryData<UpdateRestaurantResponse>
) => {
  const { _id: restaurantId, restaurant } = call.request;
  delete restaurant._id;
  if (restaurantId.length !== 24 || !ObjectId.isValid(restaurantId)) {
    callback(new Error(`Invalid ObjectId: ${restaurantId}`), null);
  } else {
    const _restaurantId = ObjectId.createFromHexString(restaurantId);
    try {
      const { result } = await db.updateRestaurant(_restaurantId, restaurant);
      if (result.n && result.n > 0) {
        callback(null, null);
      } else {
        callback(new Error("Restaurant does not exist"), null);
      }
    } catch (error) {
      callback(error, null);
    }
  }
};

interface DeleteRestaurantRequest {
  _id: string;
}

interface DeleteRestaurantResponse {}

export const deleteRestaurant: handleUnaryCall<
  DeleteRestaurantRequest,
  DeleteRestaurantResponse
> = async (
  call: ServerUnaryCall<DeleteRestaurantRequest>,
  callback: sendUnaryData<DeleteRestaurantResponse>
) => {
  const { _id: restaurantId } = call.request;
  if (restaurantId.length !== 24 || !ObjectId.isValid(restaurantId)) {
    callback(new Error(`Invalid ObjectId: ${restaurantId}`), null);
  } else {
    const _restaurantId = ObjectId.createFromHexString(restaurantId);
    try {
      const { result } = await db.deleteRestaurant(_restaurantId);
      if (result.n && result.n > 0) {
        callback(null, null);
      } else {
        callback(new Error("Restaurant does not exist"), null);
      }
    } catch (error) {
      callback(error, null);
    }
  }
};
