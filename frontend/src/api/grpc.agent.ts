import { GraphQLClient } from "graphql-request";

const DEFAULT_REACT_APP_GRPC_HOST = "localhost";
const DEFAULT_REACT_APP_GRPC_PORT = "8001";

let { REACT_APP_GRPC_HOST, REACT_APP_GRPC_PORT } = process.env;

if (!REACT_APP_GRPC_HOST) {
  console.log(
    `No REACT_APP_GRPC_HOST specified - fall back to default ${DEFAULT_REACT_APP_GRPC_HOST}`
  );
  REACT_APP_GRPC_HOST = DEFAULT_REACT_APP_GRPC_HOST;
}

if (!REACT_APP_GRPC_PORT) {
  console.log(
    `No REACT_APP_GRPC_PORT specified - fall back to default ${DEFAULT_REACT_APP_GRPC_PORT}`
  );
  REACT_APP_GRPC_PORT = DEFAULT_REACT_APP_GRPC_PORT;
}

console.log(
  `GRPC Gateway at: http://${REACT_APP_GRPC_HOST}:${REACT_APP_GRPC_PORT}`
);

const client = new GraphQLClient(
  `http://${REACT_APP_GRPC_HOST}:${REACT_APP_GRPC_PORT}`
);

export default client;
