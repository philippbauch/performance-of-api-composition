import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "grpc";
import path from "path";
import logger from "../logger";
import {
  deleteUser,
  getUser,
  getUsers,
  insertUser,
  updateUser
} from "./grpc.api";

const { PROTO_PATH } = process.env;

if (!PROTO_PATH) {
  logger.error("Environment variable PROTO_PATH is required");
  process.exit(1);
}

const USER_PROTO = "user.proto";

export const grpcServerCredentials = grpc.ServerCredentials.createInsecure();

const userProtoPath = path.join(PROTO_PATH!, USER_PROTO);

const userDefinitions = protoLoader.loadSync(userProtoPath);
const userPackage = grpc.loadPackageDefinition(userDefinitions);

const server = new grpc.Server();

// @ts-ignore
server.addService(userPackage.UserService.service, {
  getUsers,
  getUser,
  insertUser,
  updateUser,
  deleteUser
});

export default server;
