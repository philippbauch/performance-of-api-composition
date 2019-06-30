import { GraphQLClient } from "graphql-request";

const DEFAULT_GRPC_CACHED_HOST = "localhost";
const DEFAULT_GRPC_CACHED_PORT = "8003";

let { GRPC_CACHED_HOST, GRPC_CACHED_PORT } = process.env;

if (!GRPC_CACHED_HOST) {
  console.log(
    `No GRPC_CACHED_HOST specified - fall back to default ${DEFAULT_GRPC_CACHED_HOST}`
  );
  GRPC_CACHED_HOST = DEFAULT_GRPC_CACHED_HOST;
}

if (!GRPC_CACHED_PORT) {
  console.log(
    `No GRPC_CACHED_PORT specified - fall back to default ${DEFAULT_GRPC_CACHED_PORT}`
  );
  GRPC_CACHED_PORT = DEFAULT_GRPC_CACHED_PORT;
}

console.log(
  `GRPC_CACHED Gateway at: http://${GRPC_CACHED_HOST}:${GRPC_CACHED_PORT}`
);

const client = new GraphQLClient(
  `http://${GRPC_CACHED_HOST}:${GRPC_CACHED_PORT}`
);

export default client;
