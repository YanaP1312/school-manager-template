import chalk from 'chalk';
import { saveTraineeData, loadTraineeData, loadCourseData } from './storage.js';

function addTrainee(firstName, lastName) {
  if (!firstName || !lastName) {
    return chalk.red('ERROR: Must provide first and last name');
  }

  const id = Math.floor(Math.random() * 100000);
  const newTrainee = { id, firstName, lastName };

  const trainees = loadTraineeData();

  if (trainees.some((trainee) => trainee.id === id)) {
    return chalk.red(`ERROR: This id already exist`);
  }

  if (
    trainees.some(
      (trainee) =>
        trainee.firstName === firstName && trainee.lastName === lastName
    )
  ) {
    return chalk.red(
      `ERROR: The trainee with the same first and last name is already exist in the list`
    );
  }

  trainees.push(newTrainee);

  saveTraineeData(trainees);

  return chalk.cyan(`CREATED: ${id} ${firstName} ${lastName}`);
}

function updateTrainee(id, firstName, lastName) {
  if (!id || !firstName || !lastName) {
    return chalk.red(`ERROR: Must provide ID, first name and last name`);
  }

  const trainees = loadTraineeData();
  const trainee = getTraineeByIdOrThrow(trainees, id);

  trainee.firstName = firstName;
  trainee.lastName = lastName;

  saveTraineeData(trainees);

  return chalk.cyan(`UPDATED: ${id} ${firstName} ${lastName}`);
}

function deleteTrainee(id) {
  const trainees = loadTraineeData();
  const { firstName, lastName } = getTraineeByIdOrThrow(trainees, id);
  const traineesWithoutDeleted = trainees.filter(
    (trainee) => trainee.id !== id
  );

  saveTraineeData(traineesWithoutDeleted);

  return chalk.cyan(`DELETED: ${id} ${firstName} ${lastName}`);
}

function fetchTrainee(id) {
  const trainees = loadTraineeData();
  const { firstName, lastName } = getTraineeByIdOrThrow(trainees, id);
  const coursesInfo = loadCourseData();

  const traineeCourses = coursesInfo
    .filter((course) => course.participants.includes(id))
    .map((course) => course.name)
    .join(', ');

  return chalk.cyan(
    `${id} ${firstName} ${lastName}\nCourses: ${traineeCourses}`
  );
}

function fetchAllTrainees() {
  const trainees = loadTraineeData();
  const traineesSortedLastName = [...trainees].sort((a, b) =>
    a.lastName.localeCompare(b.lastName)
  );

  const traineesInfo = traineesSortedLastName
    .map(
      (trainee) =>
        `${chalk.bold(trainee.id)} ${chalk.cyan(trainee.firstName)} ${chalk.cyanBright(trainee.lastName)}`
    )
    .join('\n');

  const summary = `${chalk.bgYellowBright.bold('Trainees:')}\n${traineesInfo}\n\n${chalk.bgYellowBright.bold('Total:')} ${chalk.bold(trainees.length)}`;

  return summary;
}

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
      return chalk.red(`ERROR: Invalid TRAINEE subcommand: ${subcommand}`);
  }
}

//helpers function
export function getTraineeByIdOrThrow(trainees, id) {
  const trainee = trainees.find((trainee) => trainee.id === id);

  if (!trainee) {
    return chalk.red(`ERROR: Trainee with id ${id} doesn't exist`);
  }

  return trainee;
}
