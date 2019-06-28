export interface Review {
  _id?: string;
  userId: string;
  restaurantId: string;
  rating: number;
  comment: string;
}
