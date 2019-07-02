import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "grpc";
import path from "path";
import logger from "../logger";

const DEFAULT_RESERVATION_HOST = "localhost";
const DEFAULT_RESERVATION_PORT = "4042";

const { PROTO_PATH } = process.env;
let { RESERVATION_HOST, RESERVATION_PORT,  } = process.env;

if (!RESERVATION_HOST) {
  logger.warn(
    `No RESERVATION_HOST specified - use default value '${DEFAULT_RESERVATION_HOST}'`
  );
  RESERVATION_HOST = DEFAULT_RESERVATION_HOST;
}

if (!RESERVATION_PORT) {
  logger.warn(
    `No RESERVATION_PORT specified - use default value '${DEFAULT_RESERVATION_PORT}'`
  );
  RESERVATION_PORT = DEFAULT_RESERVATION_PORT;
}

if (!PROTO_PATH) {
  logger.warn("Environment variable PROTO_PATH is required");
  process.exit(1);
}

const URL = `${RESERVATION_HOST}:${RESERVATION_PORT}`;
console.log(`Reservation service at: ${URL}`);

const reservationProtoPath = path.join(PROTO_PATH!, "reservation.proto");

const protoDefinition = protoLoader.loadSync(reservationProtoPath);
const reservationProto = grpc.loadPackageDefinition(protoDefinition);

// @ts-ignore
const client = new reservationProto.ReservationService(
  URL,
  grpc.credentials.createInsecure()
);

export default client;
