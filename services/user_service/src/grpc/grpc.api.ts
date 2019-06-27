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
    const users = await db.findUsers({ email, firstName, lastName });
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

interface InsertUserRequest {
  user: User;
}

interface InsertUserResponse {
  user: User;
}

export const insertUser: handleUnaryCall<
  InsertUserRequest,
  InsertUserResponse
> = async (
  call: ServerUnaryCall<InsertUserRequest>,
  callback: sendUnaryData<InsertUserResponse>
) => {
  const { user } = call.request;
  delete user._id;
  try {
    const { ops, result } = await db.insertUser(user);
    if (result.ok && ops.length === 1) {
      callback(null, { user: ops[0] });
    } else {
      callback(new Error("Could not insert user"), null);
    }
  } catch (error) {
    callback(error, null);
  }
};

interface UpdateUserRequest {
  _id: string;
  user: User;
}

interface UpdateUserResponse {}

export const updateUser: handleUnaryCall<
  UpdateUserRequest,
  UpdateUserResponse
> = async (
  call: ServerUnaryCall<UpdateUserRequest>,
  callback: sendUnaryData<UpdateUserResponse>
) => {
  const { _id: userId, user } = call.request;
  delete user._id;
  if (userId.length !== 24 || !ObjectId.isValid(userId)) {
    callback(new Error(`Invalid ObjectId: ${userId}`), null);
  } else {
    const _userId = ObjectId.createFromHexString(userId);
    try {
      const { result } = await db.updateUser(_userId, user);
      if (result.n && result.n > 0) {
        callback(null, null);
      } else {
        callback(new Error("User does not exist"), null);
      }
    } catch (error) {
      callback(error, null);
    }
  }
};

interface DeleteUserRequest {
  _id: string;
}

interface DeleteUserResponse {}

export const deleteUser: handleUnaryCall<
  DeleteUserRequest,
  DeleteUserResponse
> = async (
  call: ServerUnaryCall<DeleteUserRequest>,
  callback: sendUnaryData<DeleteUserResponse>
) => {
  const { _id: userId } = call.request;
  if (userId.length !== 24 || !ObjectId.isValid(userId)) {
    callback(new Error(`Invalid ObjectId: ${userId}`), null);
  } else {
    const _userId = ObjectId.createFromHexString(userId);
    try {
      const { result } = await db.deleteUser(_userId);
      if (result.n && result.n > 0) {
        callback(null, null);
      } else {
        callback(new Error("User does not exist"), null);
      }
    } catch (error) {
      callback(error, null);
    }
  }
};
