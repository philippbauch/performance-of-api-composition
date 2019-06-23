const client = require("./client");

module.exports = function getUser() {
  client.getUsers({}, (error, users) => {
    if (!error) {
      console.log(users);
    } else {
      console.error(error);
    }
  });
};
