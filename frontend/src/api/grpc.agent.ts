import { GraphQLClient } from "graphql-request";

const DEFAULT_REACT_APP_GRPC_PORT = "8001";

let { REACT_APP_GRPC_PORT } = process.env;

if (!REACT_APP_GRPC_PORT) {
  console.log(
    `No REACT_APP_GRPC_PORT specified - fall back to default ${DEFAULT_REACT_APP_GRPC_PORT}`
  );
  REACT_APP_GRPC_PORT = DEFAULT_REACT_APP_GRPC_PORT;
}

console.log(
  `GRPC Gateway at: http://localhost:${REACT_APP_GRPC_PORT}`
);

const client = new GraphQLClient(
  `http://localhost:${REACT_APP_GRPC_PORT}`
);

export default client;
