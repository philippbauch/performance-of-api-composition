import dotenv from "dotenv";
dotenv.config();

import chalk from "chalk";
import faker from "faker";
import inquirer from "inquirer";
import ProgressBar from "progress";
import { Restaurant } from "./models/Restaurant";
import { User } from "./models/User";
import {
  deleteRestaurant,
  getRestaurants,
  postRestaurant
} from "./restaurant/restaurant.api";
import { deleteUser, getUsers, postUser } from "./user/user.api";

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
        lastName: faker.name.lastName()
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

  // --------------------------------------------------------------------------

  console.log("[ ] Look for existing restaurants");
  try {
    const restaurants = await getRestaurants({});
    if (restaurants.length > 0) {
      console.log(
        chalk.green(`[+] Found ${restaurants.length} existing restaurants`)
      );
      const { overwrite } = await inquirer.prompt({
        type: "confirm",
        name: "overwrite",
        message: "Do you want to overwrite the existing restaurants?",
        default: true
      });
      if (overwrite) {
        console.log("[ ] Delete existing restaurants");
        const deleteRestaurantsProgress = new ProgressBar(
          `[ ] Deleting [:bar] :current/${restaurants.length}`,
          {
            complete: "=",
            incomplete: " ",
            width: 50,
            total: restaurants.length
          }
        );
        for (const { _id: restaurantId } of restaurants) {
          try {
            await deleteRestaurant(restaurantId!);
          } catch (error) {
            deleteRestaurantsProgress.interrupt(
              chalk.red(`[-] Error: ${error}`)
            );
          }
          deleteRestaurantsProgress.tick();
        }
        if (deleteRestaurantsProgress.complete) {
          console.log(chalk.green("[+] Done"));
        } else {
          console.log(chalk.yellow("[!] Progress not completed"));
        }
      }
    } else {
      console.log(chalk.green("[+] No restaurants found"));
    }
  } catch (error) {
    console.log(
      chalk.red(`[-] Failed to fetch existing restaurants: ${error}`)
    );
    console.log("[ ] Proceed");
  }

  const restaurants: Restaurant[] = [];

  if (restaurantsAmount > 0) {
    console.log("[ ] Generate fake restaurants");
    const restaurantProgress = new ProgressBar(
      `[ ] Generating [:bar] :current/${restaurantsAmount}`,
      {
        complete: "=",
        incomplete: " ",
        width: 50,
        total: restaurantsAmount
      }
    );
    for (let i = 0; i < restaurantsAmount!; i++) {
      const restaurant: Restaurant = {
        name: faker.company.companyName(),
        address: {
          streetName: faker.address.streetName(),
          houseNumber: Math.floor(Math.random() * 100) + 1,
          city: faker.address.city(),
          zipCode: faker.address.zipCode()
        }
      };
      try {
        const inserted = await postRestaurant(restaurant);
        restaurants.push(inserted);
      } catch (error) {
        restaurantProgress.interrupt(chalk.red(`[-] Error: ${error}`));
      }
      restaurantProgress.tick();
    }
    if (restaurantProgress.complete) {
      console.log(chalk.green("[+] Done"));
    } else {
      console.log(chalk.yellow("[!] Progress not completed"));
    }
  } else {
    console.log("[ ] Number of restaurants to generate is 0");
    console.log("[ ] Skip");
  }
})();
