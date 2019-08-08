const packageJSON = require('./package.json');

const {
  WORKSPACE,
  SFTP_USER,
  SFTP_PASSWORD,
  SFTP_HOSTNAME,
  SFTP_PORT = 22,
  SFTP_DEST = '/app',
  GIT_REPOSITORY,
  BRANCH = 'master',
  ENCRYPTION_KEY = 'git-to-sftp-big-secret',
  ENCRYPTION_ALGORITHM = 'aes-256-cbc',
  ENCRYPTION_IV_LENGTH = 16, // For AES, this is always 16
  ENCRYPTION_PREFIX = 'Git2SFTP Rules!',
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

const ENCRYPTION = {
  KEY: ENCRYPTION_KEY,
  ALGORITHM: ENCRYPTION_ALGORITHM,
  IV_LENGTH: ENCRYPTION_IV_LENGTH,
  PREFIX: ENCRYPTION_PREFIX,
};
const VERSION = packageJSON.version;

module.exports = {
  WORKSPACE_PATH,
  GIT_REPOSITORY,
  WORKSPACE,
  SFTP,
  BRANCH,
  VERSION,
  ENCRYPTION,
};
