import { GraphQLClient } from "graphql-request";

const DEFAULT_REACT_APP_REST_CACHED_HOST = "localhost";
const DEFAULT_REACT_APP_REST_CACHED_PORT = "8002";

let { REACT_APP_REST_CACHED_HOST, REACT_APP_REST_CACHED_PORT } = process.env;

if (!REACT_APP_REST_CACHED_HOST) {
  console.log(
    `No REACT_APP_REST_CACHED_HOST specified - fall back to default ${DEFAULT_REACT_APP_REST_CACHED_HOST}`
  );
  REACT_APP_REST_CACHED_HOST = DEFAULT_REACT_APP_REST_CACHED_HOST;
}

if (!REACT_APP_REST_CACHED_PORT) {
  console.log(
    `No REACT_APP_REST_CACHED_PORT specified - fall back to default ${DEFAULT_REACT_APP_REST_CACHED_PORT}`
  );
  REACT_APP_REST_CACHED_PORT = DEFAULT_REACT_APP_REST_CACHED_PORT;
}

console.log(
  `REST_CACHED Gateway at: http://${REACT_APP_REST_CACHED_HOST}:${REACT_APP_REST_CACHED_PORT}`
);

const client = new GraphQLClient(
  `http://${REACT_APP_REST_CACHED_HOST}:${REACT_APP_REST_CACHED_PORT}`
);

export default client;
