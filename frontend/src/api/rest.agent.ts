import { GraphQLClient } from "graphql-request";

const DEFAULT_REACT_APP_REST_PORT = "8000";

let { REACT_APP_REST_PORT } = process.env;

if (!REACT_APP_REST_PORT) {
  console.log(
    `No REACT_APP_REST_PORT specified - fall back to default ${DEFAULT_REACT_APP_REST_PORT}`
  );
  REACT_APP_REST_PORT = DEFAULT_REACT_APP_REST_PORT;
}

console.log(
  `REST Gateway at: http://localhost:${REACT_APP_REST_PORT}`
);

const client = new GraphQLClient(
  `http://localhost:${REACT_APP_REST_PORT}`
);

export default client;
