import { Response } from "express";
import { logger } from "../utils/logger";

export default { as };

function as(response: Response) {
  return new Respond(response);
}

class Respond {
  private response: Response | undefined;

  constructor(response: Response) {
    this.response = response;
  }

  public with<P = any>(
    ok: number,
    status: number,
    message?: string,
    payload?: P | P[]
  ) {
    if (!this.response) {
      logger.error("Response is not initialized");
      return;
    }

    this.response.send({
      ok,
      status,
      ...(message && { message }),
      ...(payload && { payload })
    });
  }
}
