import chalk from 'chalk';
import { saveTraineeData, loadTraineeData } from './storage.js';

function addTrainee(firstName, lastName) {
  const id = Math.floor(Math.random() * 100000);
  const newTrainee = { id, firstName, lastName };

  const traineesArray = loadTraineeData();

  if (traineesArray.some((trainee) => trainee.id === id)) {
    throw new Error(chalk.red(`This id already exist`));
  }

  if (
    traineesArray.some(
      (trainee) =>
        trainee.firstName === firstName && trainee.lastName === lastName
    )
  ) {
    throw new Error(
      chalk.red(
        `The trainee with the same first and last name is already exist in the list`
      )
    );
  }

  traineesArray.push(newTrainee);

  saveTraineeData(traineesArray);

  return `CREATED: ${id} ${firstName} ${lastName}`;
}

function updateTrainee() {
  // TODO: Implement the logic
}

function deleteTrainee() {
  // TODO: Implement the logic
}

function fetchTrainee() {
  // TODO: Implement the logic
}

function fetchAllTrainees() {
  // TODO: Implement the logic
}

export function handleTraineeCommand(subcommand, args) {
  // Read the subcommand and call the appropriate function with the arguments
}

// const isString =
//   typeof firstName === 'string' && typeof lastName === 'string';

// if (!isString) {
//   throw new Error(
//     chalk.red(`First name and ast name of trainee must be a string`)
//   );
// }
