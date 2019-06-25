import { ApolloServer, gql } from "apollo-server";
import logger from "./logger";

const DEFAULT_PORT = "8000";

let { PORT } = process.env;

if (!PORT) {
  logger.warn(`No PORT specified - use default value '${DEFAULT_PORT}'`);
  PORT = DEFAULT_PORT;
}

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const users = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];

const typeDefs = gql`
  type User {
    id: ID
    email: String
    firstName: String
    lastName: String
    password: String
    favorites: [Restaurant]
    reviews: [Review]
  }

  type Address {
    street: String
    houseInt: Int
    city: String
    zipCode: String
  }

  type Restaurant {
    id: ID
    name: String
    address: Address
    reviews: [Review]
  }

  type Review {
    id: ID
    user: User
    restaurant: Restaurant
    rating: Int
    comment: String
  }

  type Reservation {
    id: ID
    user: User
    restaurant: Restaurant
    timestamp: Int
    pax: Int
  }

  type Query {
    users: [User]
    restaurants: [Restaurant]
    reservations: [Reservation]
    reviews: [Review]
  }
`;

const resolvers = {
  Query: {
    users: () => users
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
