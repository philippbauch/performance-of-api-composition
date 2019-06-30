import { GraphQLClient } from "graphql-request";

const DEFAULT_REST_CACHED_HOST = "localhost";
const DEFAULT_REST_CACHED_PORT = "8001";

let { REST_CACHED_HOST, REST_CACHED_PORT } = process.env;

if (!REST_CACHED_HOST) {
  console.log(
    `No REST_CACHED_HOST specified - fall back to default ${DEFAULT_REST_CACHED_HOST}`
  );
  REST_CACHED_HOST = DEFAULT_REST_CACHED_HOST;
}

if (!REST_CACHED_PORT) {
  console.log(
    `No REST_CACHED_PORT specified - fall back to default ${DEFAULT_REST_CACHED_PORT}`
  );
  REST_CACHED_PORT = DEFAULT_REST_CACHED_PORT;
}

console.log(
  `REST_CACHED Gateway at: http://${REST_CACHED_HOST}:${REST_CACHED_PORT}`
);

const client = new GraphQLClient(
  `http://${REST_CACHED_HOST}:${REST_CACHED_PORT}`
);

export default client;
