import type { Command } from 'commander';
import initialize from './initialize';

const register = (program: Command) => {
  program.command('init').description('initialize project from template').action(initialize);
};

export default register;
