import { handleUnaryCall, sendUnaryData, ServerUnaryCall } from "grpc";
import { ObjectId } from "mongodb";
import db from "../db";
import { User } from "../models/User";

interface GetUsersRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface GetUsersResponse {
  users: User[];
}

export const getUsers: handleUnaryCall<
  GetUsersRequest,
  GetUsersResponse
> = async (
  call: ServerUnaryCall<GetUsersRequest>,
  callback: sendUnaryData<GetUsersResponse>
) => {
  const { email, firstName, lastName } = call.request;
  try {
    const users = await db.findUsers({
      ...(email && { email }),
      ...(firstName && { firstName }),
      ...(lastName && { lastName })
    });
    callback(null, { users });
  } catch (error) {
    callback(error, null);
  }
};

interface GetUserRequest {
  _id: string;
}

interface GetUserResponse {
  user: User;
}

export const getUser: handleUnaryCall<GetUserRequest, GetUserResponse> = async (
  call: ServerUnaryCall<GetUserRequest>,
  callback: sendUnaryData<GetUserResponse>
) => {
  const { _id: userId } = call.request;
  if (userId.length !== 24 || !ObjectId.isValid(userId)) {
    callback(new Error(`Invalid ObjectId: ${userId}`), null);
  } else {
    const _userId = ObjectId.createFromHexString(userId);
    try {
      const user = await db.findUser(_userId);
      if (user) {
        callback(null, { user });
      } else {
        callback(new Error("User does not exist"), null);
      }
    } catch (error) {
      callback(error, null);
    }
  }
};
