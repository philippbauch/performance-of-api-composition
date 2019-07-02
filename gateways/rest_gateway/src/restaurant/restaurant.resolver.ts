import { Address } from "../models/Address";
import { Restaurant } from "../models/Restaurant";
import { getReservations } from "../reservation/reservation.api";
import { getReviews } from "../review/review.api";
import { getRestaurant, getRestaurants } from "./restaurant.api";

export const restaurantsResolver = (_: undefined, args: any) => {
  const { name } = args;
  return getRestaurants({ name });
};

export const restaurantResolver = (_: undefined, args: any) => {
  const { id } = args;
  return id ? getRestaurant(id) : null;
};

export const restaurantIdResolver = (restaurant: Restaurant) => restaurant._id;

export const restaurantReservationsResolver = (restaurant: Restaurant) => {
  const { _id: restaurantId } = restaurant;
  return getReservations({ restaurantId });
};

export const restaurantReviewsResolver = (restaurant: Restaurant) => {
  const { _id: restaurantId } = restaurant;
  return getReviews({ restaurantId });
};
