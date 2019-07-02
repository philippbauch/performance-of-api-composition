import axios from "axios";
import logger from "../logger";

const DEFAULT_RESTAURANT_HOST = "localhost";
const DEFAULT_RESTAURANT_PORT = "8081";

let { RESTAURANT_HOST, RESTAURANT_PORT } = process.env;

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

const URL = `http://${RESTAURANT_HOST}:${RESTAURANT_PORT}/`;
const TIMEOUT = 5000;

const agent = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: TIMEOUT
});

export default agent;
