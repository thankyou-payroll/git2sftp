import { argv } from 'yargs';
import packageJSON from './package.json';

const OPTIONS = {
  SHOW_HELP: !!argv.h,
  SHOW_VERSION: !!argv.v,
  WORKSPACE: argv.w || argv.workspace,
  SFTP_HOSTNAME: argv.h || argv.hostname,
  SFTP_USER: argv.u || argv.user,
  SFTP_PASSWORD: argv.p || argv.password,
  SFTP_PORT: argv.port,
  SFTP_DEST: argv.d || argv.dest,
  GIT_REPOSITORY: argv.r || argv.repository,
  BRANCH: argv.b || argv.branch,
};

const {
  WORKSPACE,
  SFTP_USER,
  SFTP_PASSWORD,
  SFTP_HOSTNAME,
  SFTP_PORT = 22,
  SFTP_DEST = '/app',
  GIT_REPOSITORY,
  BRANCH = 'master',
} = process.env;
const ROOT_PATH = process.cwd();
const WORKSPACE_PATH = `${ROOT_PATH}/.workspace`;
const SFTP = {
  USER: SFTP_USER,
  PASSWORD: SFTP_PASSWORD,
  HOSTNAME: SFTP_HOSTNAME,
  PORT: SFTP_PORT,
  DEST: SFTP_DEST,
};

const MAIN_BRANCH = OPTIONS.BRANCH || BRANCH;
const VERSION = packageJSON.version;
export {
  WORKSPACE_PATH,
  GIT_REPOSITORY,
  WORKSPACE,
  SFTP,
  MAIN_BRANCH,
  OPTIONS,
  VERSION,
};
