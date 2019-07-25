import { which, exec, cd, ls } from 'shelljs';
import { WORKSPACE_PATH, MAIN_BRANCH, VERSION } from './config';

const SHELL_OPTIONS = { silent: true };

const trimOutput = stdout => stdout.trim();
const splitLines = output => output.split('\n');
const getNameStatus = output => {
  const [status, ...fileNameArray] = output.split(/\t/);
  return { status: status.toUpperCase(), file: fileNameArray.join(' ').trim() };
};

const run = command =>
  new Promise((resolve, reject) => {
    exec(command, SHELL_OPTIONS, (code, stdout, stderr) =>
      code === 0 ? resolve(stdout) : reject({ code, error: stderr }),
    );
  });

const checkGit = () => {
  if (!which('git')) throw new Error('Git Not found');
};

const createWorkspace = async () => {
  try {
    await run(`mkdir ${WORKSPACE_PATH}`);
  } catch (e) {
    /* Directory already exists */
  }
};

const goToWorkspaceFolder = () => cd(WORKSPACE_PATH);

const goToProjectFolder = project => cd(`${WORKSPACE_PATH}/${project}`);

const updateRepository = () => run('git pull').then(trimOutput);

const getEmptyTreeHash = () =>
  run("printf '' | git hash-object -t tree --stdin").then(trimOutput);

const getCommits = () =>
  run('git log --oneline')
    .then(trimOutput)
    .then(splitLines);

const getChangedFiles = ({ startHash, endHash }) =>
  run(`git diff --name-status ${startHash} ${endHash}`)
    .then(trimOutput)
    .then(splitLines)
    .then(lines => lines.map(getNameStatus));

const cloneToWorkspace = (repository, name = '') => {
  goToWorkspaceFolder();
  return run(
    `git clone ${repository} -b ${MAIN_BRANCH} --single-branch ${name}`.trim(),
  ).then(() => name || repository.match(/^.+\/(.+).git$/)[1]);
};

const listWorkspaces = () => ls(WORKSPACE_PATH);

const checkout = (hash = MAIN_BRANCH) =>
  run(`git checkout ${hash}`).then(trimOutput);

const help = () => {
  console.log(`
  CLI tool for deploying code from a Git repository via SFTP in a controlled way

  usage:
    git2sftp [options]
  
  options:
    -w, --workspace     Select Workspace
    -h, --hostname      SFTP Hostname
    -u, --user          SFTP User
    -p, --password      SFTP Password
    --port              SFTP Port (Default: 22)
    -d, --dest          SFTP Remote Destiny
    -r, --repository    Git repository
    -b, --branch        Git branch (Default: master)
    -h                  Show Help
    -v                  Show Version
    `);
  process.exit(0);
};

const version = () => {
  console.log(`
git2sftp -> ${VERSION}
`);
  process.exit(0);
};

export {
  help,
  version,
  checkGit,
  createWorkspace,
  cloneToWorkspace,
  goToProjectFolder,
  updateRepository,
  getEmptyTreeHash,
  getCommits,
  getChangedFiles,
  listWorkspaces,
  checkout,
};
