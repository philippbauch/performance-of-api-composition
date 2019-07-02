import { AxiosResponse } from "axios";
import { Reservation } from "../models/Reservation";
import axiosErrorHandler from "../utils/axiosErrorHandler";
import agent from "./reservation.agent";

export interface QueryParams {
  userId?: string;
  restaurantId?: string;
  pax?: string;
}

export async function getReservations(
  params: QueryParams
): Promise<Reservation[]> {
  return agent
    .get("/reservations", { params })
    .catch(axiosErrorHandler)
    .then((response: AxiosResponse): Reservation[] => {
      const { data, statusText } = response;
      const { ok, status, message, payload } = data;
      if ((status !== 200 && status !== 204) || !ok) {
        throw message || statusText;
      }
      return payload as Reservation[];
    });
}

export function getReservation(reservationId: string): Promise<Reservation> {
  return agent
    .get(`/reservations/${reservationId}`)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Reservation => {
        const { data, statusText } = response;
        const { ok, status, message, payload } = data;
        if (status !== 200 || !ok) {
          throw message || statusText;
        }
        return payload as Reservation;
      }
    );
}

export function postReservation(reservation: Reservation) {
  return agent
    .post("/reservations", reservation)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Reservation => {
        const { data, statusText } = response;
        const { ok, status, message, payload } = data;
        if (status !== 201 || !ok) {
          throw message || statusText;
        }
        return payload as Reservation;
      }
    );
}

export function updateReservation(reservation: Reservation) {
  return agent
    .put(`/reservations/${reservation._id}`, reservation)
    .catch(axiosErrorHandler)
    .then((response: AxiosResponse): void => {
      const { data, statusText } = response;
      const { ok, status, message } = data;
      if (status !== 200 || !ok) {
        throw message || statusText;
      }
    });
}

export function deleteReservation(reservationId: string) {
  return agent
    .delete(`/reservations/${reservationId}`)
    .catch(axiosErrorHandler)
    .then((response: AxiosResponse): void => {
      const { data, statusText } = response;
      const { ok, status, message } = data;
      if (status !== 200 || !ok) {
        throw message || statusText;
      }
    });
}
