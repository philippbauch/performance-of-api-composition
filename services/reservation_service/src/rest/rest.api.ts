import express from "express";
import { ObjectId } from "mongodb";
import db from "../db";
import respond from "../respond";

const reservationApi = express.Router();

reservationApi.get("/reservations", getReservations);
reservationApi.get("/reservations/:id", getReservation);
reservationApi.post("/reservations", postReservation);
reservationApi.put("/reservations/:id", putReservation);
reservationApi.delete("/reservations/:id", deleteReservation);

async function getReservations(req: express.Request, res: express.Response) {
  let reservations, message, ok, status;
  const { userId, restaurantId, pax } = req.query;
  const _userId = userId && ObjectId.createFromHexString(userId);
  const _restaurantId =
    restaurantId && ObjectId.createFromHexString(restaurantId);
  try {
    reservations = await db.findReservations({
      ...(pax && { pax }),
      ...(_userId && { userId: _userId }),
      ...(_restaurantId && { restaurantId: _restaurantId })
    });
    ok = 1;
    status = reservations.length > 0 ? 200 : 204;
  } catch (error) {
    message = error;
    ok = 0;
    status = 500;
  }
  respond.as(res).with(ok, status, message, reservations);
}

async function getReservation(req: express.Request, res: express.Response) {
  let reservation, message, ok, status;
  const { id: reservationId } = req.params;
  if (reservationId.length !== 24 || !ObjectId.isValid(reservationId)) {
    message = `Invalid ObjectId: ${reservationId}`;
    ok = 0;
    status = 400;
  } else {
    const _reservationId = ObjectId.createFromHexString(reservationId);
    try {
      reservation = await db.findReservation(_reservationId);
      if (reservation) {
        ok = 1;
        status = 200;
      } else {
        message = "Reservation does not exist";
        ok = 0;
        status = 404;
      }
    } catch (error) {
      message = error;
      ok = 0;
      status = 500;
    }
  }
  respond.as(res).with(ok, status, message, reservation);
}

async function postReservation(req: express.Request, res: express.Response) {
  const payload = req.body;
  delete payload._id;
  let inserted, message, ok, status;
  const { userId, restaurantId } = payload;
  const _userId = userId && ObjectId.createFromHexString(userId);
  const _restaurantId =
    restaurantId && ObjectId.createFromHexString(restaurantId);
  try {
    const { ops, result } = await db.insertReservation({
      ...payload,
      ...(_userId && { userId: _userId }),
      ...(_restaurantId && { restaurantId: _restaurantId })
    });
    ok = result.ok;
    status = ok ? 201 : 500;
    inserted = ops.length === 1 ? ops[0] : null;
  } catch (error) {
    message = error;
    ok = 0;
    status = 500;
  }
  respond.as(res).with(ok, status, message, inserted);
}

async function putReservation(req: express.Request, res: express.Response) {
  const payload = req.body;
  delete payload._id;
  let message, ok, status;
  const { id: reservationId } = req.params;
  const { userId, restaurantId } = req.query;
  const _userId = userId && ObjectId.createFromHexString(userId);
  const _restaurantId =
    restaurantId && ObjectId.createFromHexString(restaurantId);
  if (reservationId.length !== 24 || !ObjectId.isValid(reservationId)) {
    message = `Invalid ObjectId: ${reservationId}`;
    ok = 0;
    status = 400;
  } else {
    const _reservationId = ObjectId.createFromHexString(reservationId);
    try {
      const { result } = await db.updateReservation(_reservationId, {
        ...payload,
        ...(_userId && { userId: _userId }),
        ...(_restaurantId && { restaurantId: _restaurantId })
      });
      if (result.n && result.n > 0) {
        ok = result.ok!;
        status = 200;
      } else {
        message = "Reservation does not exist";
        ok = 0;
        status = 404;
      }
    } catch (error) {
      message = error;
      ok = 0;
      status = 500;
    }
  }
  respond.as(res).with(ok, status, message, null);
}

async function deleteReservation(req: express.Request, res: express.Response) {
  let message, ok, status;
  const { id: reservationId } = req.params;
  if (reservationId.length !== 24 || !ObjectId.isValid(reservationId)) {
    message = `Invalid ObjectId: ${reservationId}`;
    ok = 0;
    status = 400;
  } else {
    const _reservationId = ObjectId.createFromHexString(reservationId);
    try {
      const { result } = await db.deleteReservation(_reservationId);
      if (result.n && result.n > 0) {
        ok = result.ok!;
        status = 200;
      } else {
        message = "Reservation does not exist";
        ok = 0;
        status = 404;
      }
    } catch (error) {
      message = error;
      ok = 0;
      status = 500;
    }
  }
  respond.as(res).with(ok, status, message, null);
}

export default reservationApi;
