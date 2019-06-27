import { Address } from '../models/Address';
import { Restaurant } from '../models/Restaurant';
import {
  getRestaurant,
  getRestaurants,
} from "./restaurant.api";

export const restaurantsResolver = (_: undefined, args: any) => {
  const { name } = args;
  return getRestaurants({ name });
};

export const restaurantResolver = (_: undefined, args: any) => {
  const { id } = args;
  return id ? getRestaurant(id) : null;
};

export const restaurantIdResolver = (restaurant: Restaurant) => restaurant._id;

export const restaurantNameResolver = (restaurant: Restaurant) => restaurant.name;

export const restaurantAddressResolver = (restaurant: Restaurant) => restaurant.address;

export const addressStreetResolver = (address: Address) => address.street;

export const addressHouseNumberResolver = (address: Address) => address.houseNumber;

export const addressCityResolver = (address: Address) => address.city;

export const addressZipCodeResolver = (address: Address) => address.zipCode;
