export interface Reservation {
  _id?: string;
  userId: string;
  restaurantId: string;
  pax: number;
  date: string;
}
