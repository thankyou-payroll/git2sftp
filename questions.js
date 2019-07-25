import inquirer, { Separator } from 'inquirer';
import { CONSTANTS, getHash } from './helpers';
import { GIT_REPOSITORY, WORKSPACE, SFTP, OPTIONS } from './config';
const checkEmpty = answer => (answer.length < 1 ? "It can't be empty." : true);

const ask = question =>
  inquirer
    .prompt([{ ...question, name: 'answer' }])
    .then(({ answer }) => answer);

const askWorkspace = async workspaces => {
  const worskpace =
    OPTIONS.WORKSPACE ||
    (await ask({
      type: 'list',
      message: 'Select your workspace',
      default: 'new',
      choices: [
        { name: 'New workspace', value: 'new' },
        new Separator(' = Workspaces = '),
        ...workspaces.map(workspace => ({ name: workspace })),
      ],
    }));
  return worskpace;
};

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
  const name = OPTIONS.WORKSPACE || (await ask({ message: 'Workspace name:', default: WORKSPACE }));
  return { repository, name, branch };
};

const askSFTPCredentials = async () => {
  const hostname =
    OPTIONS.SFTP_HOSTNAME ||
    (await ask({
      message: 'Please, input your SSH Host:',
      default: SFTP.HOSTNAME,
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
  return { hostname, username, password, destPath };
};

const askWhichFiles = commits =>
  ask({
    type: 'checkbox',
    message: 'Select the commits you want to deploy',
    choices: commits.reduce((result, { commit, files }) => {
      const list = [
        new Separator(` = ${commit} = `),
        ...files.map(({ status, file }) => ({
          name: `[${CONSTANTS.STATUS[status]}] ${file}`,
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
export {
  askSelectCommits,
  askGitRepository,
  askSFTPCredentials,
  askWorkspace,
  askWhichFiles,
};
