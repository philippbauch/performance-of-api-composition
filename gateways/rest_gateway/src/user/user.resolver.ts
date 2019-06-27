import { User } from '../models/User';
import { getReservations } from '../reservation/reservation.api';
import {
  getUser,
  getUsers,
} from "./user.api";

export const usersResolver = (_: undefined, args: any) => {
  const { email, firstName, lastName } = args;
  return getUsers({ email, firstName, lastName });
};

export const userResolver = (_: undefined, args: any) => {
  const { id } = args;
  return id ? getUser(id) : null;
};

export const userIdResolver = (user: User) => user._id;

export const userEmailResolver = (user: User) => user.email;

export const userFirstNameResolver = (user: User) => user.firstName;

export const userLastNameResolver = (user: User) => user.lastName;

export const userReservationsResolver = (user: User) => {
  const { _id: userId } = user;
  return getReservations({ userId });
};

export const userReviewsResolver = (user: User) => [] /* TODO */;
