import axios from "axios";
import logger from "./logger";

const DEFAULT_USER_HOST = "localhost";
const DEFAULT_USER_PORT = "8080";

let { USER_HOST, USER_PORT } = process.env;

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

const URL = `http://${USER_HOST}:${USER_PORT}/`;
const TIMEOUT = 5000;

const agent = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: TIMEOUT
});

export default agent;
