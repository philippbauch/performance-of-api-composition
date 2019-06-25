import { AxiosResponse } from "axios";
import axiosErrorHandler from "./axiosErrorHandler";
import { User } from "./User";
import agent from "./user.agent";

export interface QueryParams {
  limit?: number;
  skip?: number;
  sort?: any;
}

export async function getUsers(): Promise<User[]> {
  return agent
    .get("/users")
    .catch(axiosErrorHandler)
    .then((response: AxiosResponse): User[] => {
      const { data, statusText } = response;
      const { ok, status, message, payload } = data;
      if (status !== 200 || !!ok) {
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
        if (status !== 200 || !!ok) {
          throw message || statusText;
        }
        return payload as User;
      }
    );
}

export function postUser(user: User) {
  return agent
    .post("/projects", user)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): User => {
        const { data, statusText } = response;
        const { ok, status, message, payload } = data;
        if (status !== 201 || !!ok) {
          throw message || statusText;
        }
        return payload as User;
      }
    );
}

export function updateUser(user: User) {
  return agent
    .put(`/projects/${user._id}`, user)
    .catch(axiosErrorHandler)
    .then((response: AxiosResponse): void => {
      const { data, statusText } = response;
      const { ok, status, message } = data;
      if (status !== 200 || !!ok) {
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
      if (status !== 200 || !!ok) {
        throw message || statusText;
      }
    });
}
