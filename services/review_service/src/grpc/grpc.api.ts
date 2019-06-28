import { handleUnaryCall, sendUnaryData, ServerUnaryCall } from "grpc";
import { ObjectId } from "mongodb";
import db from "../db";
import { Review } from "../models/Review";

interface GetReviewsRequest {
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
  const { userId, restaurantId } = call.request;
  const _userId = userId && ObjectId.createFromHexString(userId);
  const _restaurantId =
    restaurantId && ObjectId.createFromHexString(restaurantId);
  try {
    const reviews = await db.findReviews({
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

interface InsertReviewRequest {
  review: Review;
}

interface InsertReviewResponse {
  review: Review;
}

export const insertReview: handleUnaryCall<
  InsertReviewRequest,
  InsertReviewResponse
> = async (
  call: ServerUnaryCall<InsertReviewRequest>,
  callback: sendUnaryData<InsertReviewResponse>
) => {
  const { review } = call.request;
  delete review._id;
  const { userId, restaurantId } = review;
  const _userId = userId && ObjectId.createFromHexString(userId);
  const _restaurantId =
    restaurantId && ObjectId.createFromHexString(restaurantId);
  try {
    const { ops, result } = await db.insertReview({
      ...review,
      ...(_userId && { userId: _userId }),
      ...(_restaurantId && { restaurantId: _restaurantId })
    });
    if (result.ok && ops.length === 1) {
      callback(null, { review: ops[0] });
    } else {
      callback(new Error("Could not insert review"), null);
    }
  } catch (error) {
    callback(error, null);
  }
};

interface UpdateReviewRequest {
  _id: string;
  review: Review;
}

interface UpdateReviewResponse {}

export const updateReview: handleUnaryCall<
  UpdateReviewRequest,
  UpdateReviewResponse
> = async (
  call: ServerUnaryCall<UpdateReviewRequest>,
  callback: sendUnaryData<UpdateReviewResponse>
) => {
  const { _id: reviewId, review } = call.request;
  delete review._id;
  const { userId, restaurantId } = review;
  const _userId = userId && ObjectId.createFromHexString(userId);
  const _restaurantId =
    restaurantId && ObjectId.createFromHexString(restaurantId);
  if (reviewId.length !== 24 || !ObjectId.isValid(reviewId)) {
    callback(new Error(`Invalid ObjectId: ${reviewId}`), null);
  } else {
    const _reviewId = ObjectId.createFromHexString(reviewId);
    try {
      const { result } = await db.updateReview(_reviewId, {
        ...review,
        ...(_userId && { userId: _userId }),
        ...(_restaurantId && { restaurantId: _restaurantId })
      });
      if (result.n && result.n > 0) {
        callback(null, null);
      } else {
        callback(new Error("Review does not exist"), null);
      }
    } catch (error) {
      callback(error, null);
    }
  }
};

interface DeleteReviewRequest {
  _id: string;
}

interface DeleteReviewResponse {}

export const deleteReview: handleUnaryCall<
  DeleteReviewRequest,
  DeleteReviewResponse
> = async (
  call: ServerUnaryCall<DeleteReviewRequest>,
  callback: sendUnaryData<DeleteReviewResponse>
) => {
  const { _id: reviewId } = call.request;
  if (reviewId.length !== 24 || !ObjectId.isValid(reviewId)) {
    callback(new Error(`Invalid ObjectId: ${reviewId}`), null);
  } else {
    const _reviewId = ObjectId.createFromHexString(reviewId);
    try {
      const { result } = await db.deleteReview(_reviewId);
      if (result.n && result.n > 0) {
        callback(null, null);
      } else {
        callback(new Error("Review does not exist"), null);
      }
    } catch (error) {
      callback(error, null);
    }
  }
};
