import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "grpc";
import path from "path";
import logger from "../logger";

const DEFAULT_USER_HOST = "localhost";
const DEFAULT_USER_PORT = "4040";

const { PROTO_PATH } = process.env;
let { USER_HOST, USER_PORT,  } = process.env;

if (!USER_HOST) {
  logger.warn(
    `No USER_HOST specified - use default value '${DEFAULT_USER_HOST}'`
  );
  USER_HOST = DEFAULT_USER_HOST;
}

if (!USER_PORT) {
  logger.warn(
    `No USER_PORT specified - use default value '${DEFAULT_USER_PORT}'`
  );
  USER_PORT = DEFAULT_USER_PORT;
}

if (!PROTO_PATH) {
  logger.warn("Environment variable PROTO_PATH is required");
  process.exit(1);
}

const URL = `${USER_HOST}:${USER_PORT}`;
console.log(`User service at: ${URL}`);

const userProtoPath = path.join(PROTO_PATH!, "user.proto");

const protoDefinition = protoLoader.loadSync(userProtoPath);
const userProto = grpc.loadPackageDefinition(protoDefinition);

// @ts-ignore
const client = new userProto.UserService(
  URL,
  grpc.credentials.createInsecure()
);

export default client;
