import { GraphQLClient } from "graphql-request";

const DEFAULT_REACT_APP_GRPC_CACHED_PORT = "8003";

let { REACT_APP_GRPC_CACHED_PORT } = process.env;

if (!REACT_APP_GRPC_CACHED_PORT) {
  console.log(
    `No REACT_APP_GRPC_CACHED_PORT specified - fall back to default ${DEFAULT_REACT_APP_GRPC_CACHED_PORT}`
  );
  REACT_APP_GRPC_CACHED_PORT = DEFAULT_REACT_APP_GRPC_CACHED_PORT;
}

console.log(
  `GRPC_CACHED Gateway at: http://localhost:${REACT_APP_GRPC_CACHED_PORT}`
);

const client = new GraphQLClient(
  `http://localhost:${REACT_APP_GRPC_CACHED_PORT}`
);

export default client;
