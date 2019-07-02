import axios from "axios";
import logger from "../logger";

const DEFAULT_REVIEW_HOST = "localhost";
const DEFAULT_REVIEW_PORT = "8083";

let { REVIEW_HOST, REVIEW_PORT } = process.env;

if (!REVIEW_HOST) {
  logger.warn(
    `No REVIEW_HOST specified - use default value '${DEFAULT_REVIEW_HOST}'`
  );
  REVIEW_HOST = DEFAULT_REVIEW_HOST;
}

if (!REVIEW_PORT) {
  logger.warn(
    `No REVIEW_PORT specified - use default value '${DEFAULT_REVIEW_PORT}'`
  );
  REVIEW_PORT = DEFAULT_REVIEW_PORT;
}

const URL = `http://${REVIEW_HOST}:${REVIEW_PORT}/`;
const TIMEOUT = 5000;

const agent = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: TIMEOUT
});

export default agent;
