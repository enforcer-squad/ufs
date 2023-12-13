import type { Command } from 'commander';

const register = (program: Command) => {
  program
    .command('serve')
    .option('-c, --config <filePath>', '配置文件路径', './ufs.config.js')
    .action(() => {
      console.log('serve 执行了');
    });

  program
    .command('build')
    .option('-c, --config <filePath>', '配置文件路径', './ufs.config.js')
    .option('-l, --lib', '是否打包库模式', false)
    .action(() => {
      console.log('build 执行了');
    });

  program
    .command('preview')
    .option('-c, --config <filePath>', '配置文件路径', './ufs.config.js')
    .action(() => {
      console.log('preview 执行了');
    });
};

export default register;
