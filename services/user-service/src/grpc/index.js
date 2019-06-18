import * as grpc from "grpc";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

export const grpcServerCredentials = grpc.ServerCredentials.createInsecure();

const userProtoPath = path.join(__dirname, "user.proto");

// Stub handler
function getUsers() {
  console.log("Works");
}

const userProto = protoLoader.loadSync(userProtoPath);
const userDefinition = grpc.loadPackageDefinition(userProto);

const server = new grpc.Server();

server.addService(userDefinition.UserService.service, { getUsers });

export default server;
