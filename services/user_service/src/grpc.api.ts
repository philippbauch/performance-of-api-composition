import { handleUnaryCall, sendUnaryData, ServerUnaryCall } from "grpc";
import { ObjectId } from "mongodb";
import db from "./db";
import { User } from "./User";

interface GetUsersRequest {}

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
  try {
    const users = await db.findUsers({});
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
  const userId = call.request._id;
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
  const user = call.request.user;
  if (!user.favorites) {
    user.favorites = [];
  }
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
  const userId = call.request._id;
  const user = call.request.user;
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
  const userId = call.request._id;
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
