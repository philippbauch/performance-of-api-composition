import * as express from "express";
import userService from "../../db/services/user.service";
import { logger } from "../../utils/logger";

const userApi = express.Router();

userApi.get("/users", getUsers);
userApi.get("/users/:id", getUser);
userApi.post("/users", postUser);
userApi.put("/users/:id", putUser);
userApi.delete("/users/:id", deleteUser);

async function getUsers(req: express.Request, res: express.Response) {
  try {
    const users = await userService.getUsers(req.query);
    res.send(users);
  } catch (error) {
    res.send(error);
  }
}

async function getUser(req: express.Request, res: express.Response) {
  logger.info("Get User");
  res.send("Get User");
}

async function putUser(req: express.Request, res: express.Response) {
  logger.info("Put User");
  res.send("Put Projecs");
}

async function postUser(req: express.Request, res: express.Response) {
  logger.info("Post User");
  res.send("Post Users");
}

async function deleteUser(req: express.Request, res: express.Response) {
  logger.info("Delete User");
  res.send("Delete Users");
}

export default userApi;
