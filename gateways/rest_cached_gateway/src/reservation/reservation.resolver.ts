import { Reservation } from "../models/Reservation";
import { getRestaurant } from "../restaurant/restaurant.api";
import { getUser } from "../user/user.api";
import { getReservation, getReservations } from "./reservation.api";

export const reservationsResolver = (_: undefined, args: any) => {
  const { userId, restaurantId, pax } = args;
  return getReservations({ userId, restaurantId, pax });
};

export const reservationResolver = (_: undefined, args: any) => {
  const { id } = args;
  return id ? getReservation(id) : null;
};

export const reservationIdResolver = (reservation: Reservation) =>
  reservation._id;

export const reservationUserResolver = (reservation: Reservation) => {
  const { userId } = reservation;
  return userId ? getUser(userId) : null;
};

export const reservationRestaurantResolver = (reservation: Reservation) => {
  const { restaurantId } = reservation;
  return restaurantId ? getRestaurant(restaurantId) : null;
};
