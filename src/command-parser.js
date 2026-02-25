export function parseCommand(userInput) {
  const parts = userInput.trim().split(' ');

  const command = parts[0];
  const subcommand = parts[1];

  if (command === 'COURSE' && subcommand === 'ADD') {
    const startDate = parts[parts.length - 1];
    const name = parts.slice(2, parts.length - 1).join(' ');
    return { command, subcommand, args: [name, startDate] };
  }

  if (command === 'COURSE' && subcommand === 'UPDATE') {
    const id = parts[2];
    const startDate = parts[parts.length - 1];
    const name = parts.slice(3, parts.length - 1).join(' ');
    return { command, subcommand, args: [id, name, startDate] };
  }

  const [_, __, ...args] = parts;

  return { command, subcommand, args };
}
