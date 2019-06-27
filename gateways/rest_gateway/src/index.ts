import { ApolloServer, gql } from "apollo-server";
import logger from "./logger";
import { User } from "./models/User";
import { 
  addressCityResolver,
  addressHouseNumberResolver,
  addressStreetResolver,
  addressZipCodeResolver,
  restaurantAddressResolver,
  restaurantIdResolver,
  restaurantNameResolver,
  restaurantResolver,
  restaurantsResolver,
} from "./restaurant/restaurant.resolver";
import { 
  userEmailResolver,
  userFirstNameResolver,
  userIdResolver,
  userLastNameResolver,
  userResolver,
  usersResolver,
} from './user/user.resolver';

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
    reservations: [Reservation]
    reviews: [Review]
  }

  type Address {
    street: String
    houseNumber: Int
    city: String
    zipCode: String
  }

  type Restaurant {
    id: ID
    name: String
    address: Address
    reviews: [Review]
    reservations: [Reservation]
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
    user(id: String): User
    users(email: String, firstName: String, lastName: String): [User]

    restaurant(id: String): Restaurant
    restaurants(name: String): [Restaurant]

    reservation(id: String): Reservation
    reservations: [Reservation]

    review(id: String): Review
    reviews: [Review]
  }
`;

const resolvers = {
  Query: {
    user: userResolver,
    users: usersResolver,
    restaurant: restaurantResolver,
    restaurants: restaurantsResolver
  },
  Address: {
    street: addressStreetResolver,
    houseNumber: addressHouseNumberResolver,
    city: addressCityResolver,
    zipCode: addressZipCodeResolver
  },
  Restaurant: {
    id: restaurantIdResolver,
    name: restaurantNameResolver,
    address: restaurantAddressResolver
  },
  User: {
    id: userIdResolver,
    email: userEmailResolver,
    firstName: userFirstNameResolver,
    lastName: userLastNameResolver
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
