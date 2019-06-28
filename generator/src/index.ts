import dotenv from "dotenv";
dotenv.config();

import chalk from "chalk";
import Chance from "chance";
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
import {
  postReservation,
  getReservations,
  deleteReservation
} from "./reservation/reservation.api";
import { getReviews, deleteReview, postReview } from "./review/review.api";

const PROBABILITY_RESERVATION = 5;
const PROBABILITY_REVIEW = 2;

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
  let users: User[] = [];
  try {
    users = await getUsers({});
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
        users = [];
      }
    } else {
      console.log(chalk.green("[+] No users found"));
    }
  } catch (error) {
    console.log(chalk.red(`[-] Failed to fetch existing users: ${error}`));
    console.log("[ ] Proceed");
  }

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
  let restaurants: Restaurant[] = [];
  try {
    restaurants = await getRestaurants({});
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
        restaurants = [];
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

  if (users.length <= 0) {
    console.log("[ ] Number of users is 0");
    console.log("[ ] Quit");
  } else if (restaurants.length <= 0) {
    console.log("[ ] Number of restaurants is 0");
    console.log("[ ] Quit");
  } else {
    const chance = new Chance();

    console.log("[ ] Look for existing reservations");
    try {
      const reservations = await getReservations({});
      if (reservations.length > 0) {
        console.log(
          chalk.green(`[+] Found ${reservations.length} existing reservations`)
        );
        const { overwrite } = await inquirer.prompt({
          type: "confirm",
          name: "overwrite",
          message: "Do you want to overwrite the existing reservations?",
          default: true
        });
        if (overwrite) {
          console.log("[ ] Delete existing reservations");
          const deleteReservationsProgress = new ProgressBar(
            `[ ] Deleting [:bar] :current/${reservations.length}`,
            {
              complete: "=",
              incomplete: " ",
              width: 50,
              total: reservations.length
            }
          );
          for (const { _id: reservationId } of reservations) {
            try {
              await deleteReservation(reservationId!);
            } catch (error) {
              deleteReservationsProgress.interrupt(
                chalk.red(`[-] Error: ${error}`)
              );
            }
            deleteReservationsProgress.tick();
          }
          if (deleteReservationsProgress.complete) {
            console.log(chalk.green("[+] Done"));
          } else {
            console.log(chalk.yellow("[!] Progress not completed"));
          }
        }
      } else {
        console.log(chalk.green("[+] No reservations found"));
      }
    } catch (error) {
      console.log(
        chalk.red(`[-] Failed to fetch existing reservations: ${error}`)
      );
      console.log("[ ] Proceed");
    }

    console.log("[ ] Generate fake reservations");
    let reservationsCounter = 0;
    const reservationProgress = new ProgressBar(
      `[ ] Generating [:bar] :current/${users.length * restaurants.length}`,
      {
        complete: "=",
        incomplete: " ",
        width: 50,
        total: users.length * restaurants.length
      }
    );
    for (const user of users) {
      for (const restaurant of restaurants) {
        if (chance.bool({ likelihood: PROBABILITY_RESERVATION })) {
          const reservation = {
            date: faker.date.future().toUTCString(),
            pax: Math.floor(Math.random() * 10) + 1,
            userId: user._id!,
            restaurantId: restaurant._id!
          };
          try {
            await postReservation(reservation);
            reservationsCounter++;
          } catch (error) {
            reservationProgress.interrupt(chalk.red(`[-] Error: ${error}`));
          }
        }
        reservationProgress.tick();
      }
    }
    if (reservationProgress.complete) {
      console.log(
        chalk.green(`[+] Generated ${reservationsCounter} reservations`)
      );
    } else {
      console.log(chalk.yellow("[!] Progress not completed"));
    }

    console.log("[ ] Look for existing reviews");
    try {
      const reviews = await getReviews({});
      if (reviews.length > 0) {
        console.log(
          chalk.green(`[+] Found ${reviews.length} existing reviews`)
        );
        const { overwrite } = await inquirer.prompt({
          type: "confirm",
          name: "overwrite",
          message: "Do you want to overwrite the existing reviews?",
          default: true
        });
        if (overwrite) {
          console.log("[ ] Delete existing reviews");
          const deleteReviewsProgress = new ProgressBar(
            `[ ] Deleting [:bar] :current/${reviews.length}`,
            {
              complete: "=",
              incomplete: " ",
              width: 50,
              total: reviews.length
            }
          );
          for (const { _id: reviewId } of reviews) {
            try {
              await deleteReview(reviewId!);
            } catch (error) {
              deleteReviewsProgress.interrupt(chalk.red(`[-] Error: ${error}`));
            }
            deleteReviewsProgress.tick();
          }
          if (deleteReviewsProgress.complete) {
            console.log(chalk.green("[+] Done"));
          } else {
            console.log(chalk.yellow("[!] Progress not completed"));
          }
        }
      } else {
        console.log(chalk.green("[+] No reviews found"));
      }
    } catch (error) {
      console.log(chalk.red(`[-] Failed to fetch existing reviews: ${error}`));
      console.log("[ ] Proceed");
    }

    console.log("[ ] Generate fake reviews");
    let reviewsCounter = 0;
    const reviewProgress = new ProgressBar(
      `[ ] Generating [:bar] :current/${users.length * restaurants.length}`,
      {
        complete: "=",
        incomplete: " ",
        width: 50,
        total: users.length * restaurants.length
      }
    );
    for (const user of users) {
      for (const restaurant of restaurants) {
        if (chance.bool({ likelihood: PROBABILITY_RESERVATION })) {
          const review = {
            comment: faker.lorem.sentence(),
            rating: Math.floor(Math.random() * 5) + 1,
            userId: user._id!,
            restaurantId: restaurant._id!
          };
          try {
            await postReview(review);
            reviewsCounter++;
          } catch (error) {
            reviewProgress.interrupt(chalk.red(`[-] Error: ${error}`));
          }
        }
        reviewProgress.tick();
      }
    }
    if (reviewProgress.complete) {
      console.log(chalk.green(`[+] Generated ${reviewsCounter} reviews`));
    } else {
      console.log(chalk.yellow("[!] Progress not completed"));
    }
  }
})();
