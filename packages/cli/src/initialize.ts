/* eslint-disable @typescript-eslint/no-var-requires */
import { globSync } from 'glob';
import path from 'node:path';
import { Command } from 'commander';
import pkg from '../package.json';

const program = new Command();

const initialize = () => {
  try {
    const pathReg = path.join(__dirname, '../../', '/**/dist/index.js');

    const cliName = Object.keys(pkg.bin)[0];

    program.name(cliName).usage('<command> [options]').version(pkg.version);

    const pluginPaths = globSync(pathReg, { ignore: ['dist/index.js'], absolute: true });

    pluginPaths.forEach(path => {
      const module = require(path);
      if (module.default !== undefined) {
        module.default(program);
      }
    });

    program.parse(process.argv);

    if (program.args.length < 1) {
      program.outputHelp();
    }
  } catch (error) {
    console.log('init plugin error', error);
  }
};

export default initialize;
