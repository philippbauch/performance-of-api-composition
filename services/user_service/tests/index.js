const { getUser } = require("./getUser.test");
const { getUsers } = require("./getUsers.test");

const DEFAULT_GRPC_PORT = "8081";

let { GRPC_PORT } = process.env;

if (!GRPC_PORT) {
  logger.warn(
    `No GRPC_PORT specified - use default value '${DEFAULT_GRPC_PORT}'`
  );
  GRPC_PORT = DEFAULT_GRPC_PORT;
}
