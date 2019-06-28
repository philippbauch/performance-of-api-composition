import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "grpc";
import path from "path";
import logger from "../logger";
import {
  deleteReview,
  getReview,
  getReviews,
  insertReview,
  updateReview
} from "./grpc.api";

const { PROTO_PATH } = process.env;

if (!PROTO_PATH) {
  logger.error("Environment variable PROTO_PATH is required");
  process.exit(1);
}

const REVIEW_PROTO = "review.proto";

export const grpcServerCredentials = grpc.ServerCredentials.createInsecure();

const reviewProtoPath = path.join(PROTO_PATH!, REVIEW_PROTO);

const reviewDefinitions = protoLoader.loadSync(reviewProtoPath);
const reviewPackage = grpc.loadPackageDefinition(reviewDefinitions);

const server = new grpc.Server();

// @ts-ignore
server.addService(reviewPackage.ReviewService.service, {
  getReviews,
  getReview,
  insertReview,
  updateReview,
  deleteReview
});

export default server;
