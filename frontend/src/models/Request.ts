import { Protocol } from "./Protocol";

export interface Request {
  id: number;
  ok: boolean;
  duration: number;
  timestamp: number;
  protocol: Protocol;
}
