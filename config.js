import packageJSON from './package.json';

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
const VERSION = packageJSON.version;
export { WORKSPACE_PATH, GIT_REPOSITORY, WORKSPACE, SFTP, BRANCH, VERSION };
