import { ApolloServer, gql } from "apollo-server";
import logger from "./logger";
import {
  reservationIdResolver,
  reservationResolver,
  reservationRestaurantResolver,
  reservationsResolver,
  reservationUserResolver
} from "./reservation/reservation.resolver";
import {
  restaurantIdResolver,
  restaurantReservationsResolver,
  restaurantResolver,
  restaurantReviewsResolver,
  restaurantsResolver,
} from "./restaurant/restaurant.resolver";
import {
  reviewIdResolver,
  reviewResolver,
  reviewRestaurantResolver,
  reviewsResolver,
  reviewUserResolver
} from "./review/review.resolver";
import {
  userIdResolver,
  userReservationsResolver,
  userResolver,
  userReviewsResolver,
  usersResolver,
} from "./user/user.resolver";

const DEFAULT_PORT = "8003";

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
    user(id: ID): User
    users(email: String, firstName: String, lastName: String): [User]

    restaurant(id: ID): Restaurant
    restaurants(name: String): [Restaurant]

    reservation(id: ID): Reservation
    reservations(pax: Int, userId: ID, restaurantId: ID): [Reservation]

    review(id: ID): Review
    reviews(rating: Int, userId: ID, restaurantId: ID): [Review]
  }
`;

const resolvers = {
  Query: {
    user: userResolver,
    users: usersResolver,
    reservation: reservationResolver,
    reservations: reservationsResolver,
    restaurant: restaurantResolver,
    restaurants: restaurantsResolver,
    review: reviewResolver,
    reviews: reviewsResolver
  },
  Reservation: {
    id: reservationIdResolver,
    user: reservationUserResolver,
    restaurant: reservationRestaurantResolver
  },
  Restaurant: {
    id: restaurantIdResolver,
    reservations: restaurantReservationsResolver,
    reviews: restaurantReviewsResolver
  },
  Review: {
    id: reviewIdResolver,
    user: reviewUserResolver,
    restaurant: reviewRestaurantResolver
  },
  User: {
    id: userIdResolver,
    reservations: userReservationsResolver,
    reviews: userReviewsResolver
  }
};

const server = new ApolloServer({ typeDefs, resolvers, tracing: true, cacheControl: { defaultMaxAge: 60 } });

server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
