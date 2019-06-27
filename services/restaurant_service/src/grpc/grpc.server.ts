import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "grpc";
import path from "path";
import logger from "../logger";
import {
  deleteRestaurant,
  getRestaurant,
  getRestaurants,
  insertRestaurant,
  updateRestaurant
} from "./grpc.api";

const { PROTO_PATH } = process.env;

if (!PROTO_PATH) {
  logger.error("Environment variable PROTO_PATH is required");
  process.exit(1);
}

const RESTAURANT_PROTO = "restaurant.proto";

export const grpcServerCredentials = grpc.ServerCredentials.createInsecure();

const restaurantProtoPath = path.join(PROTO_PATH!, RESTAURANT_PROTO);

const restaurantDefinitions = protoLoader.loadSync(restaurantProtoPath);
const restaurantPackage = grpc.loadPackageDefinition(restaurantDefinitions);

const server = new grpc.Server();

// @ts-ignore
server.addService(restaurantPackage.RestaurantService.service, {
  getRestaurants,
  getRestaurant,
  insertRestaurant,
  updateRestaurant,
  deleteRestaurant
});

export default server;
