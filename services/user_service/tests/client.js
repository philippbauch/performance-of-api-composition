const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const { PROTO_PATH } = process.env;

if (!PROTO_PATH) {
  logger.error("Environment variable PROTO_PATH is required");
  process.exit(1);
}

const userProtoPath = path.join(PROTO_PATH, "user.proto");

const protoDefinition = protoLoader.loadSync(userProtoPath);
const userProto = grpc.loadPackageDefinition(protoDefinition);

const client = new userProto.UserService(
  "localhost:8081",
  grpc.credentials.createInsecure()
);

const user = {
  email: "hello@philippbauch.com",
  firstName: "Philipp",
  lastName: "Bauch",
  password: "password"
};

client.insertUser({ user }, (error, users) => {
  if (error) {
    console.log(error);
  } else {
    console.log(users);
  }
});

// client.getUsers({}, (error, users) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(users);
//   }
// });
