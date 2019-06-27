import { AxiosError, AxiosResponse } from "axios";

export default function(error: AxiosError): AxiosResponse {
  const { message, response } = error;
  if (!response) {
    throw message;
  }
  return response;
}
