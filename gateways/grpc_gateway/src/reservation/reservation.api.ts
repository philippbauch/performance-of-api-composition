import { AxiosResponse } from "axios";
import util from "util";
import { Reservation } from "../models/Reservation";
import client from "./reservation.agent";

export interface QueryParams {
  userId?: string;
  restaurantId?: string;
  pax?: string;
}

export async function getReservations(
  params: QueryParams
): Promise<Reservation[]> {
  const getReservationsPromisified = util.promisify(client.getReservations);
  return getReservationsPromisified.call(client, params)
    .then(({ reservations }: any) => {
      return reservations;
    })
    .catch((error: any) => {
      throw error;
    });
}

export function getReservation(_id: string): Promise<Reservation> {
  const getReservationPromisified = util.promisify(client.getReservation);
  return getReservationPromisified.call(client, { _id })
    .then(({ reservation }: any) => {
      return reservation;
    })
    .catch((error: any) => {
      throw error;
    });
}
