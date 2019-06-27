import axios from "axios";
import logger from "../logger";

const DEFAULT_RESERVATION_HOST = "localhost";
const DEFAULT_RESERVATION_PORT = "8082";

let { RESERVATION_HOST, RESERVATION_PORT } = process.env;

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

const URL = `http://${RESERVATION_HOST}:${RESERVATION_PORT}/`;
const TIMEOUT = 5000;

const agent = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: TIMEOUT
});

export default agent;
