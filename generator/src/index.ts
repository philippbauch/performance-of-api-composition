import dotenv from "dotenv";
dotenv.config();

import chalk from "chalk";
import faker from "faker";
import inquirer from "inquirer";
import ProgressBar from "progress";
import { User } from "./User";
import { deleteUser, getUsers, postUser } from "./user.api";

const DEFAULT_USERS = 1000;
const DEFAULT_RESTAURANTS = 100;
const DEFAULT_REVIEWS = 0.1;
const DEFAULT_RESERVATIONS = 0.05;

(async () => {
  const { usersAmount, restaurantsAmount } = await inquirer.prompt([
    {
      type: "input",
      name: "usersAmount",
      message: `How many ${chalk.cyan.bold("users")} do you want to generate?`,
      validate: value => {
        const valid = !isNaN(parseInt(value, 10));
        return valid || "Please enter a number";
      },
      filter: Number
    },
    {
      type: "input",
      name: "restaurantsAmount",
      message: `How many ${chalk.cyan.bold(
        "restaurants"
      )} do you want to generate?`,
      validate: value => {
        const valid = !isNaN(parseInt(value, 10));
        return valid || "Please enter a number";
      },
      filter: Number
    }
  ]);

  console.log("[ ] Look for existing users");
  try {
    const users = await getUsers({});
    if (users.length > 0) {
      console.log(chalk.green(`[+] Found ${users.length} existing users`));
      const { overwrite } = await inquirer.prompt({
        type: "confirm",
        name: "overwrite",
        message: "Do you want to overwrite the existing users?",
        default: true
      });
      if (overwrite) {
        console.log("[ ] Delete existing users");
        const deleteUsersProgress = new ProgressBar(
          `[ ] Deleting [:bar] :current/${users.length}`,
          {
            complete: "=",
            incomplete: " ",
            width: 50,
            total: users.length
          }
        );
        for (const { _id: userId } of users) {
          try {
            await deleteUser(userId!);
          } catch (error) {
            deleteUsersProgress.interrupt(chalk.red(`[-] Error: ${error}`));
          }
          deleteUsersProgress.tick();
        }
        if (deleteUsersProgress.complete) {
          console.log(chalk.green("[+] Done"));
        } else {
          console.log(chalk.yellow("[!] Progress not completed"));
        }
      }
    } else {
      console.log(chalk.green("[+] No users found"));
    }
  } catch (error) {
    console.log(chalk.red(`[-] Failed to fetch existing users: ${error}`));
    console.log("[ ] Proceed");
  }

  const users: User[] = [];

  if (usersAmount > 0) {
    console.log("[ ] Generate fake users");
    const userProgress = new ProgressBar(
      `[ ] Generating [:bar] :current/${usersAmount}`,
      {
        complete: "=",
        incomplete: " ",
        width: 50,
        total: usersAmount
      }
    );
    for (let i = 0; i < usersAmount!; i++) {
      const user: User = {
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        favorites: []
      };
      try {
        const inserted = await postUser(user);
        users.push(inserted);
      } catch (error) {
        userProgress.interrupt(chalk.red(`[-] Error: ${error}`));
      }
      userProgress.tick();
    }
    if (userProgress.complete) {
      console.log(chalk.green("[+] Done"));
    } else {
      console.log(chalk.yellow("[!] Progress not completed"));
    }
  } else {
    console.log("[ ] Number of users to generate is 0");
    console.log("[ ] Skip");
  }
})();
