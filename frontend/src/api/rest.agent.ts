import { GraphQLClient } from "graphql-request";

const DEFAULT_REST_HOST = "localhost";
const DEFAULT_REST_PORT = "8000";

let { REST_HOST, REST_PORT } = process.env;

if (!REST_HOST) {
  console.log(
    `No REST_HOST specified - fall back to default ${DEFAULT_REST_HOST}`
  );
  REST_HOST = DEFAULT_REST_HOST;
}

if (!REST_PORT) {
  console.log(
    `No REST_PORT specified - fall back to default ${DEFAULT_REST_PORT}`
  );
  REST_PORT = DEFAULT_REST_PORT;
}

console.log(`REST Gateway at: http://${REST_HOST}:${REST_PORT}`);

const client = new GraphQLClient(`http://${REST_HOST}:${REST_PORT}`);

export default client;
