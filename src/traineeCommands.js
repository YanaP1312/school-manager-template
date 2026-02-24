import chalk from 'chalk';
import { saveTraineeData, loadTraineeData, loadCourseData } from './storage.js';

function addTrainee(firstName, lastName) {
  if (!firstName || !lastName) {
    throw new Error(chalk.red('Must provide first and last name'));
  }

  const id = Math.floor(Math.random() * 100000);
  const newTrainee = { id, firstName, lastName };

  const trainees = loadTraineeData();

  if (trainees.some((trainee) => trainee.id === id)) {
    throw new Error(chalk.red(`This id already exist`));
  }

  if (
    trainees.some(
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

  trainees.push(newTrainee);

  saveTraineeData(trainees);

  return `CREATED: ${id} ${firstName} ${lastName}`;
}

// console.log(addTrainee('Kate', 'Filkoni'));

export function getTraineeByIdOrThrow(trainees, id) {
  const trainee = trainees.find((trainee) => trainee.id === id);

  if (!trainee) {
    throw new Error(chalk.red(`Trainee with id ${id} doesn't exist`));
  }

  return trainee;
}

function updateTrainee(id, firstName, lastName) {
  if (!id || !firstName || !lastName) {
    throw new Error(chalk.red(`Must provide ID, first name and last name`));
  }

  const trainees = loadTraineeData();
  const trainee = getTraineeByIdOrThrow(trainees, id);

  trainee.firstName = firstName;
  trainee.lastName = lastName;

  saveTraineeData(trainees);

  return `UPDATED: ${id} ${firstName} ${lastName}`;
}
// console.log(updateTrainee(29819, 'Masha', 'Dorinko'));

function deleteTrainee(id) {
  const trainees = loadTraineeData();
  const { firstName, lastName } = getTraineeByIdOrThrow(trainees, id);
  const traineesWithoutDeleted = trainees.filter(
    (trainee) => trainee.id !== id
  );

  saveTraineeData(traineesWithoutDeleted);

  return `DELETED: ${id} ${firstName} ${lastName}`;
}
// console.log(deleteTrainee(99065));

function fetchTrainee(id) {
  const trainees = loadTraineeData();
  const { firstName, lastName } = getTraineeByIdOrThrow(trainees, id);
  const coursesInfo = loadCourseData();

  const traineeCourses = coursesInfo
    .filter((course) => course.participants.includes(id))
    .map((course) => course.name)
    .join(', ');

  return `${id} ${firstName} ${lastName}\nCourses: ${traineeCourses}`;
}
// console.log(fetchTrainee(12345));

function fetchAllTrainees() {
  const trainees = loadTraineeData();
  trainees.sort((a, b) => a.lastName.localeCompare(b.lastName));

  const traineesInfo = trainees
    .map(
      (trainee) =>
        `${chalk.bold(trainee.id)} ${chalk.cyan(trainee.firstName)} ${chalk.cyanBright(trainee.lastName)}`
    )
    .join('\n');

  const summary = `${chalk.bgYellowBright.bold('Trainees:')}\n${traineesInfo}\n\n${chalk.bgYellowBright.bold('Total:')} ${chalk.bold(trainees.length)}`;

  return summary;
}
console.log(fetchAllTrainees());

export function handleTraineeCommand(subcommand, args) {
  switch (subcommand) {
    case 'ADD': {
      const [firstName, lastName] = args;
      return addTrainee(firstName, lastName);
    }

    case 'UPDATE': {
      const [id, firstName, lastName] = args;
      return updateTrainee(Number(id), firstName, lastName);
    }

    case 'DELETE': {
      const [id] = args;
      return deleteTrainee(Number(id));
    }

    case 'GET': {
      const [id] = args;
      return fetchTrainee(Number(id));
    }

    case 'GETALL': {
      return fetchAllTrainees();
    }

    default:
      throw new Error(chalk.red(`Invalid TRAINEE subcommand: ${subcommand}`));
  }
}
