import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "grpc";
import path from "path";
import {
  deleteUser,
  getUser,
  getUsers,
  insertUser,
  updateUser
} from "./grpc.api";
import { projectRoot } from "./utils/projectRoot";

const PROTO_DIRNAME = "proto";
const USER_PROTO = "user.proto";

export const grpcServerCredentials = grpc.ServerCredentials.createInsecure();

const userProtoPath = path.join(projectRoot, PROTO_DIRNAME, USER_PROTO);

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
