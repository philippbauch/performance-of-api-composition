import { ApolloServer, gql } from "apollo-server";
import logger from "./logger";
import { 
  reservationDateResolver,
  reservationIdResolver,
  reservationPaxResolver,
  reservationResolver,
  reservationRestaurantResolver,
  reservationsResolver,
  reservationUserResolver,
} from "./reservation/reservation.resolver";
import {
  addressCityResolver,
  addressHouseNumberResolver,
  addressStreetNameResolver,
  addressZipCodeResolver,
  restaurantAddressResolver,
  restaurantIdResolver,
  restaurantNameResolver,
  restaurantResolver,
  restaurantsResolver,
  restaurantReservationsResolver
} from "./restaurant/restaurant.resolver";
import {
  userEmailResolver,
  userFirstNameResolver,
  userIdResolver,
  userLastNameResolver,
  userReservationsResolver,
  userResolver,
  usersResolver,
} from "./user/user.resolver";

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
    streetName: String
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
    date: String
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
    reservation: reservationResolver,
    reservations: reservationsResolver,
    restaurant: restaurantResolver,
    restaurants: restaurantsResolver
  },
  Address: {
    streetName: addressStreetNameResolver,
    houseNumber: addressHouseNumberResolver,
    city: addressCityResolver,
    zipCode: addressZipCodeResolver
  },
  Reservation: {
    id: reservationIdResolver,
    pax: reservationPaxResolver,
    date: reservationDateResolver,
    user: reservationUserResolver,
    restaurant: reservationRestaurantResolver
  },
  Restaurant: {
    id: restaurantIdResolver,
    name: restaurantNameResolver,
    address: restaurantAddressResolver,
    reservations: restaurantReservationsResolver
  },
  User: {
    id: userIdResolver,
    email: userEmailResolver,
    firstName: userFirstNameResolver,
    lastName: userLastNameResolver,
    reservations: userReservationsResolver
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
