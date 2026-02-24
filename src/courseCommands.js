import chalk from 'chalk';
import { saveCourseData, loadCourseData, loadTraineeData } from './storage.js';
import { getTraineeByIdOrThrow } from './traineeCommands.js';

function addCourse(name, startDate) {
  if (!name || !startDate) {
    throw new Error(chalk.red(`Must provide course name and start date`));
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(startDate)) {
    throw new Error(
      chalk.red(`Invalid start date. Must be in yyyy-MM-dd format`)
    );
  }

  const courses = loadCourseData();

  const id = Math.floor(Math.random() * 100000);
  const newCourse = { id, name, startDate, participants: [] };

  courses.push(newCourse);

  saveCourseData(courses);

  return `CREATED: ${id} ${name} ${startDate}`;
}

// console.log(addCourse('Easy introduction to Node.js', '2026-02-28'));

function getCourseByIdOrThrow(courses, id) {
  const course = courses.find((course) => course.id === id);

  if (!course) {
    throw new Error(chalk.red(`Course with ID ${id} doesn't exist`));
  }

  return course;
}

function updateCourse(id, name, startDate) {
  if (!id || !name || !startDate) {
    throw new Error(chalk.red('Must provide ID, name and start date.'));
  }

  const courses = loadCourseData();
  const course = getCourseByIdOrThrow(courses, id);

  course.name = name;
  course.startDate = startDate;

  saveCourseData(courses);

  return `UPDATE: ${id} ${name} ${startDate}`;
}

// console.log(updateCourse(95971, 'Hard introduction to Node.js', '2026-04-16'));

function deleteCourse(id) {
  const courses = loadCourseData();
  const { name } = getCourseByIdOrThrow(courses, id);
  const coursesWithoutDeleted = courses.filter((course) => course.id !== id);
  saveCourseData(coursesWithoutDeleted);
  return `DELETED: ${id} ${name}`;
}

// console.log(deleteCourse(95971));

function joinCourse(courseId, traineeId) {
  if (!courseId || !traineeId) {
    throw new Error(chalk.red(`Must provide course ID and trainee ID `));
  }
  const courses = loadCourseData();
  const trainees = loadTraineeData();
  const course = getCourseByIdOrThrow(courses, courseId);
  const trainee = getTraineeByIdOrThrow(trainees, traineeId);
  const { name } = course;
  const { firstName, lastName } = trainee;

  const traineeCourses = courses.filter((course) =>
    course.participants.includes(traineeId)
  );

  if (traineeCourses.length >= 5) {
    throw new Error(
      chalk.red(`A trainee is not allowed to join more than 5 courses.`)
    );
  }

  if (course.participants.includes(traineeId)) {
    throw new Error(chalk.red(`The Trainee has already joined this course`));
  }

  if (course.participants.length > 20) {
    throw new Error(chalk.red(`The course is full.`));
  }

  course.participants.push(traineeId);
  saveCourseData(courses);

  return `${firstName + ' ' + lastName} Joined ${name}`;
}

// console.log(joinCourse(77421, 12867));

function leaveCourse(courseId, traineeId) {
  // return `${firstName} Left ${name} `
}

function getCourse() {
  // TODO: Implement logic
}

function getAllCourses() {
  // TODO: Implement logic
}

export function handleCourseCommand(subcommand, args) {
  // Read the subcommand and call the appropriate function with the arguments
}
