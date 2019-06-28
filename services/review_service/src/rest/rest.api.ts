import express from "express";
import { ObjectId } from "mongodb";
import db from "../db";
import respond from "../respond";

const reviewApi = express.Router();

reviewApi.get("/reviews", getReviews);
reviewApi.get("/reviews/:id", getReview);
reviewApi.post("/reviews", postReview);
reviewApi.put("/reviews/:id", putReview);
reviewApi.delete("/reviews/:id", deleteReview);

async function getReviews(req: express.Request, res: express.Response) {
  let reviews, message, ok, status;
  const { userId, restaurantId, rating } = req.query;
  const _userId = userId && ObjectId.createFromHexString(userId);
  const _restaurantId =
    restaurantId && ObjectId.createFromHexString(restaurantId);
  try {
    reviews = await db.findReviews({
      rating,
      ...(_userId && { userId: _userId }),
      ...(_restaurantId && { restaurantId: _restaurantId })
    });
    ok = 1;
    status = reviews.length > 0 ? 200 : 204;
  } catch (error) {
    message = error;
    ok = 0;
    status = 500;
  }
  respond.as(res).with(ok, status, message, reviews);
}

async function getReview(req: express.Request, res: express.Response) {
  let review, message, ok, status;
  const { id: reviewId } = req.params;
  if (reviewId.length !== 24 || !ObjectId.isValid(reviewId)) {
    message = `Invalid ObjectId: ${reviewId}`;
    ok = 0;
    status = 400;
  } else {
    const _reviewId = ObjectId.createFromHexString(reviewId);
    try {
      review = await db.findReview(_reviewId);
      if (review) {
        ok = 1;
        status = 200;
      } else {
        message = "Review does not exist";
        ok = 0;
        status = 404;
      }
    } catch (error) {
      message = error;
      ok = 0;
      status = 500;
    }
  }
  respond.as(res).with(ok, status, message, review);
}

async function postReview(req: express.Request, res: express.Response) {
  const payload = req.body;
  delete payload._id;
  let inserted, message, ok, status;
  const { userId, restaurantId } = payload;
  const _userId = userId && ObjectId.createFromHexString(userId);
  const _restaurantId =
    restaurantId && ObjectId.createFromHexString(restaurantId);
  try {
    const { ops, result } = await db.insertReview({
      ...payload,
      ...(_userId && { userId: _userId }),
      ...(_restaurantId && { restaurantId: _restaurantId })
    });
    ok = result.ok;
    status = ok ? 201 : 500;
    inserted = ops.length === 1 ? ops[0] : null;
  } catch (error) {
    message = error;
    ok = 0;
    status = 500;
  }
  respond.as(res).with(ok, status, message, inserted);
}

async function putReview(req: express.Request, res: express.Response) {
  const payload = req.body;
  delete payload._id;
  let message, ok, status;
  const { id: reviewId } = req.params;
  const { userId, restaurantId } = req.query;
  const _userId = userId && ObjectId.createFromHexString(userId);
  const _restaurantId =
    restaurantId && ObjectId.createFromHexString(restaurantId);
  if (reviewId.length !== 24 || !ObjectId.isValid(reviewId)) {
    message = `Invalid ObjectId: ${reviewId}`;
    ok = 0;
    status = 400;
  } else {
    const _reviewId = ObjectId.createFromHexString(reviewId);
    try {
      const { result } = await db.updateReview(_reviewId, {
        ...payload,
        ...(_userId && { userId: _userId }),
        ...(_restaurantId && { restaurantId: _restaurantId })
      });
      if (result.n && result.n > 0) {
        ok = result.ok!;
        status = 200;
      } else {
        message = "Review does not exist";
        ok = 0;
        status = 404;
      }
    } catch (error) {
      message = error;
      ok = 0;
      status = 500;
    }
  }
  respond.as(res).with(ok, status, message, null);
}

async function deleteReview(req: express.Request, res: express.Response) {
  let message, ok, status;
  const { id: reviewId } = req.params;
  if (reviewId.length !== 24 || !ObjectId.isValid(reviewId)) {
    message = `Invalid ObjectId: ${reviewId}`;
    ok = 0;
    status = 400;
  } else {
    const _reviewId = ObjectId.createFromHexString(reviewId);
    try {
      const { result } = await db.deleteReview(_reviewId);
      if (result.n && result.n > 0) {
        ok = result.ok!;
        status = 200;
      } else {
        message = "Review does not exist";
        ok = 0;
        status = 404;
      }
    } catch (error) {
      message = error;
      ok = 0;
      status = 500;
    }
  }
  respond.as(res).with(ok, status, message, null);
}

export default reviewApi;
