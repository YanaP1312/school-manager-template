import chalk from 'chalk';
import { saveCourseData, loadCourseData, loadTraineeData } from './storage.js';
import { getTraineeByIdOrThrow } from './traineeCommands.js';

export function addCourse(name, startDate) {
  if (!name || !startDate) {
    return chalk.red(`ERROR: Must provide course name and start date`);
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(startDate)) {
    return chalk.red(`ERROR: Invalid start date. Must be in yyyy-MM-dd format`);
  }

  const courses = loadCourseData();

  const id = Math.floor(Math.random() * 100000);
  const newCourse = { id, name, startDate, participants: [] };

  courses.push(newCourse);

  saveCourseData(courses);

  return chalk.cyan(`CREATED: ${id} ${name} ${startDate}`);
}

function updateCourse(id, name, startDate) {
  if (!id || !name || !startDate) {
    return chalk.red('ERROR: Must provide ID, name and start date.');
  }

  const courses = loadCourseData();
  const course = getCourseByIdOrThrow(courses, id);

  course.name = name;
  course.startDate = startDate;

  saveCourseData(courses);

  return chalk.cyan(`UPDATE: ${id} ${name} ${startDate}`);
}

function deleteCourse(id) {
  const courses = loadCourseData();
  const { name } = getCourseByIdOrThrow(courses, id);
  const coursesWithoutDeleted = courses.filter((course) => course.id !== id);
  saveCourseData(coursesWithoutDeleted);
  return chalk.cyan(`DELETED: ${id} ${name}`);
}

function joinCourse(courseId, traineeId) {
  const { courses, course, courseName, traineeName } = getCourseWithTrainee(
    courseId,
    traineeId
  );

  const traineeCourses = courses.filter((course) =>
    course.participants.includes(traineeId)
  );

  if (traineeCourses.length >= 5) {
    return chalk.red(
      `ERROR: A trainee is not allowed to join more than 5 courses.`
    );
  }

  if (course.participants.includes(traineeId)) {
    return chalk.red(`ERROR: The Trainee has already joined this course`);
  }

  if (course.participants.length >= 20) {
    return chalk.red(`ERROR: The course is full.`);
  }

  course.participants.push(traineeId);
  saveCourseData(courses);

  return chalk.cyan(`${traineeName} Joined ${courseName}`);
}

function leaveCourse(courseId, traineeId) {
  const { courses, course, courseName, traineeName } = getCourseWithTrainee(
    courseId,
    traineeId
  );

  if (!course.participants.includes(traineeId)) {
    return chalk.red(`ERROR: The Trainee did not join the course`);
  }

  course.participants = course.participants.filter(
    (participant) => participant !== traineeId
  );

  saveCourseData(courses);

  return chalk.cyan(`${traineeName} Left ${courseName} `);
}

function getCourse(id) {
  const courses = loadCourseData();
  const course = getCourseByIdOrThrow(courses, id);
  const { id: courseId, name, startDate } = course;
  const trainees = loadTraineeData();
  const output = [];

  const courseParticipantsInfo = trainees.filter((trainee) =>
    course.participants.includes(trainee.id)
  );

  courseParticipantsInfo.forEach((participant) => {
    const { id: traineeId, firstName, lastName } = participant;
    output.push(
      `- ${traineeId} ${chalk.cyan(firstName)} ${chalk.cyanBright(lastName)}`
    );
  });

  const courseSummary = `${chalk.bgYellowBright.bold(`${courseId} ${name} ${startDate}`)}\n${chalk.bold('Participants')} (${courseParticipantsInfo.length}):\n${output.join(`\n`)}`;

  return courseSummary;
}

function getAllCourses() {
  const courses = loadCourseData();
  const output = [];

  const coursesSortedByData = [...courses].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  coursesSortedByData.forEach((course) => {
    const { id, name, startDate, participants } = course;
    const isFull = participants.length >= 20 ? 'FULL' : '';
    output.push(
      `${chalk.bold(id)} ${chalk.cyan(name)} ${startDate} ${participants.length} ${chalk.cyanBright(isFull)}`
    );
  });
  const allCoursesSummary = `${chalk.bgYellowBright.bold('Courses:')}\n${output.join(`\n`)}\n\n${chalk.bgYellowBright.bold('Total:')} ${chalk.bold(output.length)}`;
  return allCoursesSummary;
}

export function handleCourseCommand(subcommand, args) {
  switch (subcommand) {
    case 'ADD': {
      const [name, startDate] = args;
      return addCourse(name, startDate);
    }

    case 'UPDATE': {
      const [id, name, startDate] = args;
      return updateCourse(Number(id), name, startDate);
    }

    case 'DELETE': {
      const [id] = args;
      return deleteCourse(Number(id));
    }

    case 'JOIN': {
      const [courseId, traineeId] = args;
      return joinCourse(Number(courseId), Number(traineeId));
    }

    case 'LEAVE': {
      const [courseId, traineeId] = args;
      return leaveCourse(Number(courseId), Number(traineeId));
    }

    case 'GET': {
      const [id] = args;
      return getCourse(Number(id));
    }

    case 'GETALL': {
      return getAllCourses();
    }

    default:
      return chalk.red(`ERROR: Invalid COURSE subcommand: ${subcommand}`);
  }
}

// helpers functions
function getCourseByIdOrThrow(courses, id) {
  const course = courses.find((course) => course.id === id);

  if (!course) {
    return chalk.red(`ERROR: Course with ID ${id} doesn't exist`);
  }

  return course;
}

function getCourseWithTrainee(courseId, traineeId) {
  if (!courseId || !traineeId) {
    return chalk.red(`ERROR: Must provide course ID and trainee ID `);
  }
  const courses = loadCourseData();
  const trainees = loadTraineeData();
  const course = getCourseByIdOrThrow(courses, courseId);
  const trainee = getTraineeByIdOrThrow(trainees, traineeId);

  return {
    courses,
    course,
    courseName: course.name,
    traineeName: `${trainee.firstName} ${trainee.lastName}`,
  };
}
