import db from "./db";
import grpcServer, { grpcServerCredentials } from "./grpc.server";
import logger from "./logger";
import restServer from "./rest.server";

const DEFAULT_REST_PORT = "8080";
const DEFAULT_GRPC_PORT = "8081";
const DEFAULT_DB_NAME = "poac";
const DEFAULT_DB_HOST = "localhost";
const DEFAULT_DB_PORT = "27017";

let { DB_NAME, DB_HOST, DB_PORT, REST_PORT, GRPC_PORT } = process.env;
const { DB_USER, DB_PASSWORD } = process.env;

if (!REST_PORT) {
  logger.warn(
    `No REST_PORT specified - use default value '${DEFAULT_REST_PORT}'`
  );
  REST_PORT = DEFAULT_REST_PORT;
}

if (!GRPC_PORT) {
  logger.warn(
    `No GRPC_PORT specified - use default value '${DEFAULT_GRPC_PORT}'`
  );
  GRPC_PORT = DEFAULT_GRPC_PORT;
}

if (!DB_HOST) {
  logger.warn(`No DB_HOST specified - use default value '${DEFAULT_DB_HOST}'`);
  DB_HOST = DEFAULT_DB_HOST;
}

if (!DB_PORT) {
  logger.warn(`No DB_PORT specified - use default value '${DEFAULT_DB_PORT}'`);
  DB_PORT = DEFAULT_DB_PORT;
}

if (!DB_NAME) {
  logger.warn(`No DB_NAME specified - use default value '${DEFAULT_DB_NAME}'`);
  DB_NAME = DEFAULT_DB_NAME;
}

(async () => {
  logger.info("---------- User Service ----------");

  logger.info("[1] Establish database connection");

  const auth = DB_USER &&
    DB_PASSWORD && { user: DB_USER, password: DB_PASSWORD };

  try {
    await db.connect({
      database: DB_NAME!,
      host: DB_HOST!,
      port: Number(DB_PORT!),
      ...(auth && { auth })
    });

    logger.info("Connected to database");
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }

  logger.info("[2] Start gRPC-Server");
  const boundPort = grpcServer.bind(
    `0.0.0.0:${GRPC_PORT}`,
    grpcServerCredentials
  );
  if (boundPort === 0) {
    logger.error(`Failed to bind gRPC-Server to port ${GRPC_PORT}`);
    process.exit(1);
  }
  logger.info(`gRPC-Server is running on port ${boundPort}`);
  grpcServer.start();

  logger.info("[3] Start REST-Server");
  restServer.listen(REST_PORT, () => {
    logger.info(`REST-Server is running on port ${REST_PORT}`);
  });
})();
