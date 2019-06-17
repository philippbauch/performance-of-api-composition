import express from "express";
import { ObjectId } from "mongodb";
import userService from "../../db/services/user.service";
import { logger } from "../../utils/logger";
import respond from "../../utils/respond";

const userApi = express.Router();

userApi.get("/users", getUsers);
userApi.get("/users/:id", getUser);
userApi.post("/users", postUser);
userApi.put("/users/:id", putUser);
userApi.delete("/users/:id", deleteUser);

async function getUsers(req: express.Request, res: express.Response) {
  let users, message, ok, status;
  try {
    users = await userService.findUsers(req.query);
    ok = true;
    status = users.length > 0 ? 200 : 204;
  } catch (error) {
    message = error;
    ok = false;
    status = 500;
  }
  respond.as(res).with(ok, status, message, users);
}

async function getUser(req: express.Request, res: express.Response) {
  let user, message, ok, status;
  const { id: userId } = req.params;
  if (userId.length !== 24 || !ObjectId.isValid(userId)) {
    message = `Invalid ObjectId: ${userId}`;
    ok = false;
    status = 400;
  } else {
    const _userId = ObjectId.createFromHexString(userId);
    try {
      user = await userService.findUser(_userId);
      ok = true;
      status = user ? 200 : 204;
    } catch (error) {
      message = error;
      ok = false;
      status = 500;
    }
  }
  respond.as(res).with(ok, status, message, user);
}

async function putUser(req: express.Request, res: express.Response) {
  logger.info("Put User");
  res.send("Put Projecs");
}

async function postUser(req: express.Request, res: express.Response) {
  const payload = req.body;
  let inserted, message, ok, status;
  try {
    const { ops, result } = await userService.insertUser(payload);
    ok = !!result.ok;
    status = ok ? 201 : 500;
    inserted = ops.length > 1 ? ops : ops.length === 1 ? ops[0] : null;
  } catch (error) {
    message = error;
    ok = false;
    status = 500;
  }
  respond.as(res).with(ok, status, message, inserted);
}

async function deleteUser(req: express.Request, res: express.Response) {
  logger.info("Delete User");
  res.send("Delete Users");
}

export default userApi;
