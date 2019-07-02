import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "grpc";
import path from "path";
import logger from "../logger";

const DEFAULT_RESTAURANT_HOST = "localhost";
const DEFAULT_RESTAURANT_PORT = "4041";

const { PROTO_PATH } = process.env;
let { RESTAURANT_HOST, RESTAURANT_PORT,  } = process.env;

if (!RESTAURANT_HOST) {
  logger.warn(
    `No RESTAURANT_HOST specified - use default value '${DEFAULT_RESTAURANT_HOST}'`
  );
  RESTAURANT_HOST = DEFAULT_RESTAURANT_HOST;
}

if (!RESTAURANT_PORT) {
  logger.warn(
    `No RESTAURANT_PORT specified - use default value '${DEFAULT_RESTAURANT_PORT}'`
  );
  RESTAURANT_PORT = DEFAULT_RESTAURANT_PORT;
}

if (!PROTO_PATH) {
  logger.warn("Environment variable PROTO_PATH is required");
  process.exit(1);
}

const URL = `${RESTAURANT_HOST}:${RESTAURANT_PORT}`;
console.log(`Restaurant service at: ${URL}`);

const restaurantProtoPath = path.join(PROTO_PATH!, "restaurant.proto");

const protoDefinition = protoLoader.loadSync(restaurantProtoPath);
const restaurantProto = grpc.loadPackageDefinition(protoDefinition);

// @ts-ignore
const client = new restaurantProto.RestaurantService(
  URL,
  grpc.credentials.createInsecure()
);

export default client;
