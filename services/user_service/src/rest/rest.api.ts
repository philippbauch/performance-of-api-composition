import express from "express";
import { ObjectId } from "mongodb";
import db from "../db";
import respond from "../respond";

const userApi = express.Router();

userApi.get("/users", getUsers);
userApi.get("/users/:id", getUser);
userApi.post("/users", postUser);
userApi.put("/users/:id", putUser);
userApi.delete("/users/:id", deleteUser);

async function getUsers(req: express.Request, res: express.Response) {
  let users, message, ok, status;
  try {
    users = await db.findUsers(req.query);
    ok = 1;
    status = users.length > 0 ? 200 : 204;
  } catch (error) {
    message = error;
    ok = 0;
    status = 500;
  }
  respond.as(res).with(ok, status, message, users);
}

async function getUser(req: express.Request, res: express.Response) {
  let user, message, ok, status;
  const { id: userId } = req.params;
  if (userId.length !== 24 || !ObjectId.isValid(userId)) {
    message = `Invalid ObjectId: ${userId}`;
    ok = 0;
    status = 400;
  } else {
    const _userId = ObjectId.createFromHexString(userId);
    try {
      user = await db.findUser(_userId);
      if (user) {
        ok = 1;
        status = 200;
      } else {
        message = "User does not exist";
        ok = 0;
        status = 404;
      }
    } catch (error) {
      message = error;
      ok = 0;
      status = 500;
    }
  }
  respond.as(res).with(ok, status, message, user);
}

async function postUser(req: express.Request, res: express.Response) {
  const payload = req.body;
  delete payload._id;
  let inserted, message, ok, status;
  try {
    const { ops, result } = await db.insertUser(payload);
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

async function putUser(req: express.Request, res: express.Response) {
  const payload = req.body;
  delete payload._id;
  let message, ok, status;
  const { id: userId } = req.params;
  if (userId.length !== 24 || !ObjectId.isValid(userId)) {
    message = `Invalid ObjectId: ${userId}`;
    ok = 0;
    status = 400;
  } else {
    const _userId = ObjectId.createFromHexString(userId);
    try {
      const { result } = await db.updateUser(_userId, payload);
      if (result.n && result.n > 0) {
        ok = result.ok!;
        status = 200;
      } else {
        message = "User does not exist";
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

async function deleteUser(req: express.Request, res: express.Response) {
  let message, ok, status;
  const { id: userId } = req.params;
  if (userId.length !== 24 || !ObjectId.isValid(userId)) {
    message = `Invalid ObjectId: ${userId}`;
    ok = 0;
    status = 400;
  } else {
    const _userId = ObjectId.createFromHexString(userId);
    try {
      const { result } = await db.deleteUser(_userId);
      if (result.n && result.n > 0) {
        ok = result.ok!;
        status = 200;
      } else {
        message = "User does not exist";
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

export default userApi;
