import chalk from 'chalk';
import { parseCommand } from './command-parser.js';
import promptSync from 'prompt-sync';
import { handleCourseCommand } from './courseCommands.js';
import { handleTraineeCommand } from './traineeCommands.js';

const prompt = promptSync({ sigint: true });

export function startApp() {
  console.log(chalk.cyan('Welcome to School Manager!'));
  console.log(chalk.yellow('Type QUIT or q to exit.'));

  while (true) {
    const userInput = prompt('> ');

    if (!userInput) continue;

    if (userInput === 'QUIT' || userInput === 'q') {
      console.log(chalk.cyan('Goodbye!'));
      break;
    }

    const { command, subcommand, args } = parseCommand(userInput);

    if (!command || !subcommand) {
      console.log(chalk.red('ERROR: Invalid command format'));
      continue;
    }

    try {
      let result;

      switch (command) {
        case 'COURSE':
          result = handleCourseCommand(subcommand, args);
          break;

        case 'TRAINEE':
          result = handleTraineeCommand(subcommand, args);
          break;

        default:
          console.log(chalk.red(`ERROR: Unknown command: ${command}`));
          continue;
      }

      if (result !== undefined) {
        console.log(result);
      }
    } catch (err) {
      console.log(chalk.red(err.message));
    }
  }
}

startApp();
