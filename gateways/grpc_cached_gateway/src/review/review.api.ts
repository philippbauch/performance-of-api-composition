import util from "util";
import { Review } from "../models/Review";
import client from "./review.agent";

export interface QueryParams {
  rating?: string;
  userId?: string;
  restaurantId?: string;
}

export async function getReviews(params: QueryParams): Promise<Review[]> {
  const getReviewsPromisified = util.promisify(client.getReviews);
  return getReviewsPromisified.call(client, params)
    .then(({ reviews }: any) => {
      return reviews;
    })
    .catch((error: any) => {
      throw error;
    });
}

export function getReview(_id: string): Promise<Review> {
  const getReviewPromisified = util.promisify(client.getReview);
  return getReviewPromisified.call(client, { _id })
    .then(({ review }: any) => {
      return review;
    })
    .catch((error: any) => {
      throw error;
    });
}
