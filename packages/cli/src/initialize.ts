/* eslint-disable @typescript-eslint/no-var-requires */
import { globSync } from 'glob';
import { Command } from 'commander';
import pkg from '../package.json';

const program = new Command();

const initialize = () => {
  try {
    const cliName = Object.keys(pkg.bin)[0];

    program.name(cliName).usage('<command> [options]').version(pkg.version);

    const pluginPaths = globSync('../**/dist/index.js', { ignore: ['dist/index.js'], absolute: true });
    pluginPaths.forEach(path => {
      const module = require(path);
      module.default(program);
    });

    program.parse(process.argv);

    if (program.args.length < 1) {
      program.outputHelp();
    }
  } catch (error) {
    console.log('init plugin error');
  }
};

export default initialize;
