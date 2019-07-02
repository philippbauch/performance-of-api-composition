import { handleUnaryCall, sendUnaryData, ServerUnaryCall } from "grpc";
import { ObjectId } from "mongodb";
import db from "../db";
import { Reservation } from "../models/Reservation";

interface GetReservationsRequest {
  pax?: string;
  userId?: string;
  restaurantId?: string;
}

interface GetReservationsResponse {
  reservations: Reservation[];
}

export const getReservations: handleUnaryCall<
  GetReservationsRequest,
  GetReservationsResponse
> = async (
  call: ServerUnaryCall<GetReservationsRequest>,
  callback: sendUnaryData<GetReservationsResponse>
) => {
  const { userId, restaurantId, pax } = call.request;
  const _userId = userId && ObjectId.createFromHexString(userId);
  const _restaurantId =
    restaurantId && ObjectId.createFromHexString(restaurantId);
  try {
    const reservations = await db.findReservations({
      ...(pax && { pax }),
      ...(_userId && { userId: _userId }),
      ...(_restaurantId && { restaurantId: _restaurantId })
    });
    callback(null, { reservations });
  } catch (error) {
    callback(error, null);
  }
};

interface GetReservationRequest {
  _id: string;
}

interface GetReservationResponse {
  reservation: Reservation;
}

export const getReservation: handleUnaryCall<
  GetReservationRequest,
  GetReservationResponse
> = async (
  call: ServerUnaryCall<GetReservationRequest>,
  callback: sendUnaryData<GetReservationResponse>
) => {
  const { _id: reservationId } = call.request;
  if (reservationId.length !== 24 || !ObjectId.isValid(reservationId)) {
    callback(new Error(`Invalid ObjectId: ${reservationId}`), null);
  } else {
    const _reservationId = ObjectId.createFromHexString(reservationId);
    try {
      const reservation = await db.findReservation(_reservationId);
      if (reservation) {
        callback(null, { reservation });
      } else {
        callback(new Error("Reservation does not exist"), null);
      }
    } catch (error) {
      callback(error, null);
    }
  }
};
