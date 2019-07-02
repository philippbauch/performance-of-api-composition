import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "grpc";
import path from "path";
import logger from "../logger";

const DEFAULT_REVIEW_HOST = "localhost";
const DEFAULT_REVIEW_PORT = "4043";

const { PROTO_PATH } = process.env;
let { REVIEW_HOST, REVIEW_PORT,  } = process.env;

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

if (!PROTO_PATH) {
  logger.warn("Environment variable PROTO_PATH is required");
  process.exit(1);
}

const URL = `${REVIEW_HOST}:${REVIEW_PORT}`;
console.log(`Review service at: ${URL}`);

const reviewProtoPath = path.join(PROTO_PATH!, "review.proto");

const protoDefinition = protoLoader.loadSync(reviewProtoPath);
const reviewProto = grpc.loadPackageDefinition(protoDefinition);

// @ts-ignore
const client = new reviewProto.ReviewService(
  URL,
  grpc.credentials.createInsecure()
);

export default client;
