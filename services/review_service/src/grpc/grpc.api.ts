import { handleUnaryCall, sendUnaryData, ServerUnaryCall } from "grpc";
import { ObjectId } from "mongodb";
import db from "../db";
import { Review } from "../models/Review";

interface GetReviewsRequest {
  rating?: number;
  userId?: string;
  restaurantId?: string;
}

interface GetReviewsResponse {
  reviews: Review[];
}

export const getReviews: handleUnaryCall<
  GetReviewsRequest,
  GetReviewsResponse
> = async (
  call: ServerUnaryCall<GetReviewsRequest>,
  callback: sendUnaryData<GetReviewsResponse>
) => {
  const { userId, restaurantId, rating } = call.request;
  const _userId = userId && ObjectId.createFromHexString(userId);
  const _restaurantId =
    restaurantId && ObjectId.createFromHexString(restaurantId);
  try {
    const reviews = await db.findReviews({
      ...(rating && { rating }),
      ...(_userId && { userId: _userId }),
      ...(_restaurantId && { restaurantId: _restaurantId })
    });
    callback(null, { reviews });
  } catch (error) {
    callback(error, null);
  }
};

interface GetReviewRequest {
  _id: string;
}

interface GetReviewResponse {
  review: Review;
}

export const getReview: handleUnaryCall<
  GetReviewRequest,
  GetReviewResponse
> = async (
  call: ServerUnaryCall<GetReviewRequest>,
  callback: sendUnaryData<GetReviewResponse>
) => {
  const { _id: reviewId } = call.request;
  if (reviewId.length !== 24 || !ObjectId.isValid(reviewId)) {
    callback(new Error(`Invalid ObjectId: ${reviewId}`), null);
  } else {
    const _reviewId = ObjectId.createFromHexString(reviewId);
    try {
      const review = await db.findReview(_reviewId);
      if (review) {
        callback(null, { review });
      } else {
        callback(new Error("Review does not exist"), null);
      }
    } catch (error) {
      callback(error, null);
    }
  }
};
