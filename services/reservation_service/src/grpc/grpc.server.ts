import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "grpc";
import path from "path";
import logger from "../logger";
import {
  deleteReservation,
  getReservation,
  getReservations,
  insertReservation,
  updateReservation
} from "./grpc.api";

const { PROTO_PATH } = process.env;

if (!PROTO_PATH) {
  logger.error("Environment variable PROTO_PATH is required");
  process.exit(1);
}

const RESTAURANT_PROTO = "reservation.proto";

export const grpcServerCredentials = grpc.ServerCredentials.createInsecure();

const reservationProtoPath = path.join(PROTO_PATH!, RESTAURANT_PROTO);

const reservationDefinitions = protoLoader.loadSync(reservationProtoPath);
const reservationPackage = grpc.loadPackageDefinition(reservationDefinitions);

const server = new grpc.Server();

// @ts-ignore
server.addService(reservationPackage.ReservationService.service, {
  getReservations,
  getReservation,
  insertReservation,
  updateReservation,
  deleteReservation
});

export default server;
