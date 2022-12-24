import chalk from 'chalk';
import util from 'util';

export const warn = (...args: Parameters<typeof util.format>) =>
  console.warn(chalk.bgYellow.black(' WARNING '), util.format(...args));
