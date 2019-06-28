import { AxiosResponse } from "axios";
import { Restaurant } from "../models/Restaurant";
import axiosErrorHandler from "../utils/axiosErrorHandler";
import agent from "./restaurant.agent";

export interface QueryParams {
  name?: string;
}

export async function getRestaurants(params: QueryParams): Promise<Restaurant[]> {
  return agent
    .get("/restaurants", { params })
    .catch(axiosErrorHandler)
    .then((response: AxiosResponse): Restaurant[] => {
      const { data, statusText } = response;
      const { ok, status, message, payload } = data;
      if (status !== 200 && status !== 204 || !ok) {
        throw message || statusText;
      }
      return payload as Restaurant[];
    });
}

export function getRestaurant(restaurantId: string): Promise<Restaurant> {
  return agent
    .get(`/restaurants/${restaurantId}`)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Restaurant => {
        const { data, statusText } = response;
        const { ok, status, message, payload } = data;
        if (status !== 200 || !ok) {
          throw message || statusText;
        }
        return payload as Restaurant;
      }
    );
}

export function postRestaurant(restaurant: Restaurant) {
  return agent
    .post("/restaurants", restaurant)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Restaurant => {
        const { data, statusText } = response;
        const { ok, status, message, payload } = data;
        if (status !== 201 || !ok) {
          throw message || statusText;
        }
        return payload as Restaurant;
      }
    );
}

export function updateRestaurant(restaurant: Restaurant) {
  return agent
    .put(`/restaurants/${restaurant._id}`, restaurant)
    .catch(axiosErrorHandler)
    .then((response: AxiosResponse): void => {
      const { data, statusText } = response;
      const { ok, status, message } = data;
      if (status !== 200 || !ok) {
        throw message || statusText;
      }
    });
}

export function deleteRestaurant(restaurantId: string) {
  return agent
    .delete(`/restaurants/${restaurantId}`)
    .catch(axiosErrorHandler)
    .then((response: AxiosResponse): void => {
      const { data, statusText } = response;
      const { ok, status, message } = data;
      if (status !== 200 || !ok) {
        throw message || statusText;
      }
    });
}
