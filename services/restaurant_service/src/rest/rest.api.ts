import express from "express";
import { ObjectId } from "mongodb";
import db from "../db";
import respond from "../respond";

const restaurantApi = express.Router();

restaurantApi.get("/restaurants", getRestaurants);
restaurantApi.get("/restaurants/:id", getRestaurant);
restaurantApi.post("/restaurants", postRestaurant);
restaurantApi.put("/restaurants/:id", putRestaurant);
restaurantApi.delete("/restaurants/:id", deleteRestaurant);

async function getRestaurants(req: express.Request, res: express.Response) {
  let restaurants, message, ok, status;
  try {
    restaurants = await db.findRestaurants(req.query);
    ok = 1;
    status = restaurants.length > 0 ? 200 : 204;
  } catch (error) {
    message = error;
    ok = 0;
    status = 500;
  }
  respond.as(res).with(ok, status, message, restaurants);
}

async function getRestaurant(req: express.Request, res: express.Response) {
  let restaurant, message, ok, status;
  const { id: restaurantId } = req.params;
  if (restaurantId.length !== 24 || !ObjectId.isValid(restaurantId)) {
    message = `Invalid ObjectId: ${restaurantId}`;
    ok = 0;
    status = 400;
  } else {
    const _restaurantId = ObjectId.createFromHexString(restaurantId);
    try {
      restaurant = await db.findRestaurant(_restaurantId);
      if (restaurant) {
        ok = 1;
        status = 200;
      } else {
        message = "Restaurant does not exist";
        ok = 0;
        status = 404;
      }
    } catch (error) {
      message = error;
      ok = 0;
      status = 500;
    }
  }
  respond.as(res).with(ok, status, message, restaurant);
}

async function postRestaurant(req: express.Request, res: express.Response) {
  const payload = req.body;
  delete payload._id;
  let inserted, message, ok, status;
  try {
    const { ops, result } = await db.insertRestaurant(payload);
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

async function putRestaurant(req: express.Request, res: express.Response) {
  const payload = req.body;
  delete payload._id;
  let message, ok, status;
  const { id: restaurantId } = req.params;
  if (restaurantId.length !== 24 || !ObjectId.isValid(restaurantId)) {
    message = `Invalid ObjectId: ${restaurantId}`;
    ok = 0;
    status = 400;
  } else {
    const _restaurantId = ObjectId.createFromHexString(restaurantId);
    try {
      const { result } = await db.updateRestaurant(_restaurantId, payload);
      if (result.n && result.n > 0) {
        ok = result.ok!;
        status = 200;
      } else {
        message = "Restaurant does not exist";
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

async function deleteRestaurant(req: express.Request, res: express.Response) {
  let message, ok, status;
  const { id: restaurantId } = req.params;
  if (restaurantId.length !== 24 || !ObjectId.isValid(restaurantId)) {
    message = `Invalid ObjectId: ${restaurantId}`;
    ok = 0;
    status = 400;
  } else {
    const _restaurantId = ObjectId.createFromHexString(restaurantId);
    try {
      const { result } = await db.deleteRestaurant(_restaurantId);
      if (result.n && result.n > 0) {
        ok = result.ok!;
        status = 200;
      } else {
        message = "Restaurant does not exist";
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

export default restaurantApi;
