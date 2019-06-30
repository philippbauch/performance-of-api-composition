import { GraphQLClient } from "graphql-request";

const DEFAULT_GRPC_HOST = "localhost";
const DEFAULT_GRPC_PORT = "8002";

let { GRPC_HOST, GRPC_PORT } = process.env;

if (!GRPC_HOST) {
  console.log(
    `No GRPC_HOST specified - fall back to default ${DEFAULT_GRPC_HOST}`
  );
  GRPC_HOST = DEFAULT_GRPC_HOST;
}

if (!GRPC_PORT) {
  console.log(
    `No GRPC_PORT specified - fall back to default ${DEFAULT_GRPC_PORT}`
  );
  GRPC_PORT = DEFAULT_GRPC_PORT;
}

console.log(`GRPC Gateway at: http://${GRPC_HOST}:${GRPC_PORT}`);

const client = new GraphQLClient(`http://${GRPC_HOST}:${GRPC_PORT}`);

export default client;
