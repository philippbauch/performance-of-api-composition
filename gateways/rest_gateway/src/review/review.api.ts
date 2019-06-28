import { AxiosResponse } from "axios";
import { Review } from "../models/Review";
import axiosErrorHandler from "../utils/axiosErrorHandler";
import agent from "./review.agent";

export interface QueryParams {
  rating?: string;
  userId?: string;
  restaurantId?: string;
}

export async function getReviews(params: QueryParams): Promise<Review[]> {
  return agent
    .get("/reviews", { params })
    .catch(axiosErrorHandler)
    .then((response: AxiosResponse): Review[] => {
      const { data, statusText } = response;
      const { ok, status, message, payload } = data;
      if (status !== 200 && status !== 204 || !ok) {
        throw message || statusText;
      }
      return payload as Review[];
    });
}

export function getReview(reviewId: string): Promise<Review> {
  return agent
    .get(`/reviews/${reviewId}`)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Review => {
        const { data, statusText } = response;
        const { ok, status, message, payload } = data;
        if (status !== 200 || !ok) {
          throw message || statusText;
        }
        return payload as Review;
      }
    );
}

export function postReview(review: Review) {
  return agent
    .post("/reviews", review)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Review => {
        const { data, statusText } = response;
        const { ok, status, message, payload } = data;
        if (status !== 201 || !ok) {
          throw message || statusText;
        }
        return payload as Review;
      }
    );
}

export function updateReview(review: Review) {
  return agent
    .put(`/reviews/${review._id}`, review)
    .catch(axiosErrorHandler)
    .then((response: AxiosResponse): void => {
      const { data, statusText } = response;
      const { ok, status, message } = data;
      if (status !== 200 || !ok) {
        throw message || statusText;
      }
    });
}

export function deleteReview(reviewId: string) {
  return agent
    .delete(`/reviews/${reviewId}`)
    .catch(axiosErrorHandler)
    .then((response: AxiosResponse): void => {
      const { data, statusText } = response;
      const { ok, status, message } = data;
      if (status !== 200 || !ok) {
        throw message || statusText;
      }
    });
}
