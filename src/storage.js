import fs from 'node:fs';
import chalk from 'chalk';

const TRAINEE_DATA_FILE_PATH = './data/trainees.json';
const COURSE_DATA_FILE_PATH = './data/courses.json';

export function loadTraineeData() {
  try {
    const traineeData = JSON.parse(
      fs.readFileSync(TRAINEE_DATA_FILE_PATH, 'utf-8')
    );
    if (!Array.isArray(traineeData)) {
      throw new Error(chalk.red('Trainee data must be an array'));
    }
    return traineeData;
  } catch (error) {
    if (error.code === 'ENOENT') {
      fs.writeFileSync(TRAINEE_DATA_FILE_PATH, JSON.stringify([], null, 2));
      return [];
    } else if (error.name === 'SyntaxError') {
      throw new Error(
        chalk.red(
          `Data file is corrupted. Please fix JSON manually: ${TRAINEE_DATA_FILE_PATH}`
        )
      );
    }
    error.message = chalk.red(error.message);
    throw error;
  }
}

console.log(loadTraineeData());

export function saveTraineeData(updatedData) {
  try {
    if (!Array.isArray(updatedData)) {
      throw new Error(chalk.red('Trainee data must be an array'));
    }
    fs.writeFileSync(
      TRAINEE_DATA_FILE_PATH,
      JSON.stringify(updatedData, null, 2)
    );
  } catch (error) {
    throw new Error(chalk.red(`Failed to save trainee data: ${error.message}`));
  }
}

export function loadCourseData() {
  try {
    const courseData = JSON.parse(
      fs.readFileSync(COURSE_DATA_FILE_PATH, 'utf-8')
    );

    if (!Array.isArray(courseData)) {
      throw new Error(chalk.red('Course data must be an array'));
    }

    return courseData;
  } catch (error) {
    if (error.code === 'ENOENT') {
      fs.writeFileSync(COURSE_DATA_FILE_PATH, JSON.stringify([], null, 2));
      return [];
    } else if (error.name === 'SyntaxError') {
      throw new Error(
        chalk.red(
          `Data file is corrupted. Please fix JSON manually: ${COURSE_DATA_FILE_PATH}`
        )
      );
    }
    error.message = chalk.red(error.message);
    throw error;
  }
}

export function saveCourseData(updateData) {
  try {
    if (!Array.isArray(updateData)) {
      throw new Error(chalk.red('Course data must be an array'));
    }
    fs.writeFileSync(
      COURSE_DATA_FILE_PATH,
      JSON.stringify(updateData, null, 2)
    );
  } catch (error) {
    throw new Error(chalk.red(`Failed to save course data: ${error.message}`));
  }
}
