import db from "./db/manager";
import userService from "./db/services/user.service";
import restServer from "./rest";
import { logger } from "./utils/logger";

const DEFAULT_PORT = "8080";
const DEFAULT_DB_NAME = "poac";
const DEFAULT_DB_HOST = "localhost";
const DEFAULT_DB_PORT = "27017";

let { DB_NAME, DB_HOST, DB_PORT, PORT } = process.env;
const { DB_USER, DB_PASSWORD } = process.env;

if (!PORT) {
  logger.warn(`No PORT specified - use default value '${DEFAULT_PORT}'`);
  PORT = DEFAULT_PORT;
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

const run = async () => {
  logger.info("---------- Boot User Service ----------");

  logger.info("[1] Establish database connection");

  try {
    const auth = DB_USER &&
      DB_PASSWORD && { user: DB_USER, password: DB_PASSWORD };

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

  logger.info("[2] Load database services");

  try {
    await userService.load();

    logger.info("Loaded all database services");
  } catch (error) {
    logger.error(error);
  }

  //   logger.info("---------- Start gRPC-Server ----------");
  //   grpcServer.listen(PORT, () => {
  //     logger.info(`grpc-Server is running on port ${PORT}`);
  //   });

  logger.info("---------- Start REST-Server ----------");
  restServer.listen(PORT, () => {
    logger.info(`REST-Server is running on port ${PORT}`);
  });
};

run();
