import { Reservation } from '../models/Reservation';
import { getRestaurant } from '../restaurant/restaurant.api';
import { getUser } from '../user/user.api';
import {
  getReservation,
  getReservations,
} from "./reservation.api";

export const reservationsResolver = (_: undefined, args: any) => {
  const { userId, restaurantId } = args;
  return getReservations({ userId, restaurantId });
};

export const reservationResolver = (_: undefined, args: any) => {
  const { id } = args;
  return id ? getReservation(id) : null;
};

export const reservationIdResolver = (reservation: Reservation) => reservation._id;

export const reservationPaxResolver = (reservation: Reservation) => reservation.pax;

export const reservationDateResolver = (reservation: Reservation) => reservation.date;

export const reservationUserResolver = (reservation: Reservation) => {
  const { userId } = reservation;
  return userId ? getUser(userId) : null;
};

export const reservationRestaurantResolver = (reservation: Reservation) => {
  const { restaurantId } = reservation;
  return restaurantId ? getRestaurant(restaurantId) : null;
};
