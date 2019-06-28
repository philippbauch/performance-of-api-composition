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

interface InsertReservationRequest {
  reservation: Reservation;
}

interface InsertReservationResponse {
  reservation: Reservation;
}

export const insertReservation: handleUnaryCall<
  InsertReservationRequest,
  InsertReservationResponse
> = async (
  call: ServerUnaryCall<InsertReservationRequest>,
  callback: sendUnaryData<InsertReservationResponse>
) => {
  const { reservation } = call.request;
  delete reservation._id;
  const { userId, restaurantId } = reservation;
  const _userId = userId && ObjectId.createFromHexString(userId);
  const _restaurantId =
    restaurantId && ObjectId.createFromHexString(restaurantId);
  try {
    const { ops, result } = await db.insertReservation({
      ...reservation,
      ...(_userId && { userId: _userId }),
      ...(_restaurantId && { restaurantId: _restaurantId })
    });
    if (result.ok && ops.length === 1) {
      callback(null, { reservation: ops[0] });
    } else {
      callback(new Error("Could not insert reservation"), null);
    }
  } catch (error) {
    callback(error, null);
  }
};

interface UpdateReservationRequest {
  _id: string;
  reservation: Reservation;
}

interface UpdateReservationResponse {}

export const updateReservation: handleUnaryCall<
  UpdateReservationRequest,
  UpdateReservationResponse
> = async (
  call: ServerUnaryCall<UpdateReservationRequest>,
  callback: sendUnaryData<UpdateReservationResponse>
) => {
  const { _id: reservationId, reservation } = call.request;
  delete reservation._id;
  const { userId, restaurantId } = reservation;
  const _userId = userId && ObjectId.createFromHexString(userId);
  const _restaurantId =
    restaurantId && ObjectId.createFromHexString(restaurantId);
  if (reservationId.length !== 24 || !ObjectId.isValid(reservationId)) {
    callback(new Error(`Invalid ObjectId: ${reservationId}`), null);
  } else {
    const _reservationId = ObjectId.createFromHexString(reservationId);
    try {
      const { result } = await db.updateReservation(_reservationId, {
        ...reservation,
        ...(_userId && { userId: _userId }),
        ...(_restaurantId && { restaurantId: _restaurantId })
      });
      if (result.n && result.n > 0) {
        callback(null, null);
      } else {
        callback(new Error("Reservation does not exist"), null);
      }
    } catch (error) {
      callback(error, null);
    }
  }
};

interface DeleteReservationRequest {
  _id: string;
}

interface DeleteReservationResponse {}

export const deleteReservation: handleUnaryCall<
  DeleteReservationRequest,
  DeleteReservationResponse
> = async (
  call: ServerUnaryCall<DeleteReservationRequest>,
  callback: sendUnaryData<DeleteReservationResponse>
) => {
  const { _id: reservationId } = call.request;
  if (reservationId.length !== 24 || !ObjectId.isValid(reservationId)) {
    callback(new Error(`Invalid ObjectId: ${reservationId}`), null);
  } else {
    const _reservationId = ObjectId.createFromHexString(reservationId);
    try {
      const { result } = await db.deleteReservation(_reservationId);
      if (result.n && result.n > 0) {
        callback(null, null);
      } else {
        callback(new Error("Reservation does not exist"), null);
      }
    } catch (error) {
      callback(error, null);
    }
  }
};
