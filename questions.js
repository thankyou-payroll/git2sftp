const inquirer = require('inquirer');
const { CONSTANTS, getHash } = require('./helpers');
const { OPTIONS } = require('./commands');
const { GIT_REPOSITORY, WORKSPACE, SFTP } = require('./config');
const credentials = require('./credentials');

const { Separator } = inquirer;
const { LABELS } = CONSTANTS.GIT_STATUS;

const checkEmpty = answer => (answer.length < 1 ? "It can't be empty." : true);

const ask = question =>
  inquirer
    .prompt([{ ...question, name: 'answer' }])
    .then(({ answer }) => answer);

const askWorkspace = async workspaces =>
  OPTIONS.WORKSPACE ||
  (await ask({
    type: 'list',
    message: 'Select your workspace',
    default: CONSTANTS.NEW,
    choices: [
      { name: 'New workspace', value: CONSTANTS.NEW },
      new Separator(' = Workspaces = '),
      ...workspaces.map(workspace => ({ name: workspace })),
    ],
  }));

const askSelectCommits = commits =>
  ask({
    type: 'checkbox',
    message: 'Select the commits you want to deploy',
    choices: [
      new Separator(' = Commits = '),
      ...commits.map(commit => ({ name: commit })),
    ],
    validate: answer =>
      answer.length < 1 ? 'You must choose at least one commit.' : true,
  }).then(selectedCommits => selectedCommits.reverse());

const askGitRepository = async () => {
  const repository =
    OPTIONS.GIT_REPOSITORY ||
    (await ask({
      message: 'Please, input the git repository:',
      default: GIT_REPOSITORY,
      validate: checkEmpty,
    }));
  const branch =
    OPTIONS.GIT_REPOSITORY ||
    (await ask({
      message: 'Please, input the branch:',
      default: GIT_REPOSITORY,
      validate: checkEmpty,
    }));
  const name =
    OPTIONS.WORKSPACE ||
    (await ask({ message: 'Workspace name:', default: WORKSPACE }));
  return { repository, name, branch };
};

const askSelectRemote = hostnames =>
  ask({
    type: 'list',
    message: 'Select your hostname',
    default: CONSTANTS.NEW,
    choices: [
      { name: 'New hostname', value: CONSTANTS.NEW },
      new Separator(' = Hostnames = '),
      ...hostnames.map(hostname => ({
        name: hostname,
        value: { hostname, ...credentials.get(hostname) },
      })),
    ],
  });

const askSFTPCredentials = async () => {
  const hostname =
    OPTIONS.SFTP_HOSTNAME ||
    (await ask({
      message: 'Please, input your SSH Host:',
      default: SFTP.HOSTNAME,
      validate: checkEmpty,
    }));
  const port =
    OPTIONS.SFTP_PORT ||
    (await ask({
      message: 'Please, input your SSH Port:',
      default: SFTP.PORT,
      validate: checkEmpty,
    }));
  const username =
    OPTIONS.SFTP_USER ||
    (await ask({
      message: 'Please, input your SSH User:',
      default: SFTP.USER,
      validate: checkEmpty,
    }));
  const password =
    OPTIONS.SFTP_PASSWORD ||
    (await ask({
      type: 'password',
      message: 'Please, input your SSH Password:',
      default: SFTP.PASSWORD,
      validate: checkEmpty,
    }));
  const destPath =
    OPTIONS.SFTP_DEST ||
    (await ask({
      message: 'Please, input your Remote destination path:',
      default: SFTP.DEST,
      validate: checkEmpty,
    }));
  return { hostname, port, username, password, destPath };
};

const askSaveCredentials = () =>
  ask({
    type: 'list',
    message: 'Do you want to save this credentials?',
    default: false,
    choices: [{ name: 'Yes', value: true }, { name: 'No', value: false }],
  });

const askWhichFiles = commits =>
  ask({
    type: 'checkbox',
    message: 'Select the commits you want to deploy',
    choices: commits.reduce((result, { commit, files }) => {
      const list = [
        new Separator(` = ${commit} = `),
        ...files.map(({ status, file }) => ({
          name: `[${LABELS[status]}] ${file}`,
          value: { commit, file, status },
        })),
      ];
      return [...result, ...list];
    }, []),
    validate: answer =>
      answer.length < 1 ? 'You must choose at least one file.' : true,
  }).then(selectedFiles =>
    selectedFiles.reduce((result, { commit, status, file }) => {
      const hash = getHash(commit);
      const files = result[hash] || [];
      return {
        ...result,
        [hash]: [...files, { status, file }],
      };
    }, {}),
  );
module.exports = {
  askSelectRemote,
  askSelectCommits,
  askGitRepository,
  askSFTPCredentials,
  askSaveCredentials,
  askWorkspace,
  askWhichFiles,
};
