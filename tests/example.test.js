import { describe, expect, test } from 'vitest';
import { parseCommand } from '../src/command-parser.js';
import { addCourse, handleCourseCommand } from '../src/courseCommands.js';

describe('parseCommand', () => {
  test('parses commands for trainee and course functions', () => {
    const result = parseCommand(
      'COURSE ADD Easy introduction to React 2026-05-01'
    );
    expect(result.command).toBe('COURSE');
    expect(result.subcommand).toBe('ADD');
    expect(result.args).toEqual(['Easy introduction to React', '2026-05-01']);
  });
});

describe('addCourse', () => {
  test('returns error for invalid date', () => {
    const result = addCourse('Basic HTML + CSS', '2026-5-1');
    expect(result).toContain('Invalid start date');
  });
});

describe('addCourse', () => {
  test('returns error when name is missing', () => {
    const result = addCourse('', '2026-05-01');
    expect(result).toContain('Must provide course name and start date');
  });
});

describe('handleCourseCommand', () => {
  test('returns error for invalid subcommand', () => {
    const result = handleCourseCommand('WRONG', []);
    expect(result).toContain('Invalid COURSE subcommand');
  });
});
