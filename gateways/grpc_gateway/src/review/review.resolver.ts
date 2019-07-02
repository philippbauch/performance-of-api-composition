import { Review } from "../models/Review";
import { getRestaurant } from "../restaurant/restaurant.api";
import { getUser } from "../user/user.api";
import { getReview, getReviews } from "./review.api";

export const reviewsResolver = (_: undefined, args: any) => {
  const { userId, restaurantId, rating } = args;
  return getReviews({ userId, restaurantId, rating });
};

export const reviewResolver = (_: undefined, args: any) => {
  const { id } = args;
  return id ? getReview(id) : null;
};

export const reviewIdResolver = (review: Review) => review._id;

export const reviewRatingResolver = (review: Review) => review.rating;

export const reviewCommentResolver = (review: Review) => review.comment;

export const reviewUserResolver = (review: Review) => {
  const { userId } = review;
  return getUser(userId);
};

export const reviewRestaurantResolver = (review: Review) => {
  const { restaurantId } = review;
  return getRestaurant(restaurantId);
};
