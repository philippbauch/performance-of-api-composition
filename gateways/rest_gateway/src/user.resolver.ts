import { User } from './User';
import {
  deleteUser,
  getUser,
  getUsers,
  postUser,
  updateUser
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

export const userFavoritesResolver = (user: User) => [] /* TODO */;

export const userReviewsResolver = (user: User) => [] /* TODO */;
