import { Protocol } from "./Protocol";

export interface Query {
  title: string;
  content: string;
  protocol: Protocol;
  caching: boolean;
  amount: number;
}
