import { ApolloServer, gql } from "apollo-server";
import logger from "./logger";
import { User } from "./User";
import { userResolver, usersResolver } from './user.resolver';

const DEFAULT_PORT = "8000";

let { PORT } = process.env;

if (!PORT) {
  logger.warn(`No PORT specified - use default value '${DEFAULT_PORT}'`);
  PORT = DEFAULT_PORT;
}

const typeDefs = gql`
  type User {
    id: ID
    email: String
    firstName: String
    lastName: String
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
    users(email: String, firstName: String, lastName: String): [User]
    user(id: String): User
    restaurants: [Restaurant]
    reservations: [Reservation]
    reviews: [Review]
  }
`;

const resolvers = {
  Query: {
    user: userResolver,
    users: usersResolver,
  },
  User: {
    id: (user: User) => user._id
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
