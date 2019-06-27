import { AxiosResponse } from "axios";
import axiosErrorHandler from "./axiosErrorHandler";
import { User } from "./User";
import agent from "./user.agent";

export interface QueryParams {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export async function getUsers(params: QueryParams): Promise<User[]> {
  return agent
    .get("/users", { params })
    .catch(axiosErrorHandler)
    .then((response: AxiosResponse): User[] => {
      const { data, statusText } = response;
      const { ok, status, message, payload } = data;
      if (status !== 200 && status !== 204 || !ok) {
        throw message || statusText;
      }
      return payload as User[];
    });
}

export function getUser(userId: string): Promise<User> {
  return agent
    .get(`/users/${userId}`)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): User => {
        const { data, statusText } = response;
        const { ok, status, message, payload } = data;
        if (status !== 200 || !ok) {
          throw message || statusText;
        }
        return payload as User;
      }
    );
}

export function postUser(user: User) {
  return agent
    .post("/users", user)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): User => {
        const { data, statusText } = response;
        const { ok, status, message, payload } = data;
        if (status !== 201 || !ok) {
          throw message || statusText;
        }
        return payload as User;
      }
    );
}

export function updateUser(user: User) {
  return agent
    .put(`/users/${user._id}`, user)
    .catch(axiosErrorHandler)
    .then((response: AxiosResponse): void => {
      const { data, statusText } = response;
      const { ok, status, message } = data;
      if (status !== 200 || !ok) {
        throw message || statusText;
      }
    });
}

export function deleteUser(userId: string) {
  return agent
    .delete(`/users/${userId}`)
    .catch(axiosErrorHandler)
    .then((response: AxiosResponse): void => {
      const { data, statusText } = response;
      const { ok, status, message } = data;
      if (status !== 200 || !ok) {
        throw message || statusText;
      }
    });
}
