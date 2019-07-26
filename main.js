import {
  OPTIONS,
  checkGit,
  goToProjectFolder,
  updateRepository,
  getChangedFiles,
  getCommits,
  getEmptyTreeHash,
  createWorkspace,
  cloneToWorkspace,
  listWorkspaces,
  checkout,
  help,
  version,
} from './commands';
import {
  askSelectCommits,
  askWorkspace,
  askGitRepository,
  askSFTPCredentials,
  askWhichFiles,
} from './questions';
import messages from './messages';
import { CONSTANTS, getHash, pipe } from './helpers';
import { deploy } from './sftp';
import { WORKSPACE_PATH } from './config';

const processError = (ex, message) => {
  messages.fail(message);
  console.error(ex);
  process.exit(1);
};

const checkDependencies = () => {
  try {
    messages.start({ text: 'Check dependencies' });
    checkGit();
    messages.success();
  } catch (ex) {
    processError(ex, ex.message);
  }
};

const setupWorkspace = async () => {
  const workspaces = listWorkspaces();
  let workspace =
    workspaces.length > 0 ? await askWorkspace(workspaces) : CONSTANTS.NEW;
  if (workspace === CONSTANTS.NEW) {
    const { repository, name } = await askGitRepository();
    messages.start({ text: `Clone repository into workspace ${name}` });
    try {
      workspace = await cloneToWorkspace(repository, name);
      goToProjectFolder(workspace);
    } catch (ex) {
      const errorMessage = `There was a problem cloning the workspace. Please check if already exists.`;
      processError(ex, errorMessage);
    }
  } else {
    try {
      messages.start({ text: 'Update code' });
      goToProjectFolder(workspace);
      await checkout();
      await updateRepository();
    } catch (ex) {
      const errorMessage = `There was a problem updating the workspace. Please check the workspace.`;
      processError(ex, errorMessage);
    }
  }
  const emptyTreeHash = await getEmptyTreeHash();
  const commits = await getCommits();
  const firstCommit = commits[commits.length - 1];
  messages.success(`Code updated to last commit **${commits[0]}**`);
  const isFirstCommit = hash => getHash(firstCommit) === hash;
  const getHashFilter = hash => ({
    startHash: isFirstCommit(hash) ? emptyTreeHash : `${hash}~1`,
    endHash: hash,
  });
  return {
    workspace,
    commits,
    getFiles: pipe(
      getHash,
      getHashFilter,
      getChangedFiles,
    ),
  };
};

const setup = async () => {
  await createWorkspace();
  return await setupWorkspace();
};

const workflows = {
  deploy: async ({ filesPerCommit, projectPath, credentials }) => {
    try {
      for (const hash in filesPerCommit) {
        messages.start({ text: `Deploying changes from commit ${hash}` });
        await checkout(hash);
        await deploy({
          projectPath,
          files: filesPerCommit[hash],
          ...credentials,
        });
        messages.success(`Changes from commit ${hash} deployed`);
      }
    } catch (ex) {
      const errorMessage = `There was a problem deploying the changes. Please check if your your credentials and your destination path are correct.`;
      processError(ex, errorMessage);
    }
  },
  rollback: async ({ filesPerCommit, projectPath, credentials }) => {
    try {
      for (const hash in filesPerCommit) {
        messages.start({ text: `Rolling back changes from commit ${hash}` });
        await checkout(`${hash}~1`);
        await deploy({
          projectPath,
          files: filesPerCommit[hash],
          ...credentials,
          isRollback: true,
        });
        messages.success(`Changes from commit ${hash} rolled back`);
      }
    } catch (ex) {
      const errorMessage = `There was a problem rolling back the changes. Please check if your your credentials and your destination path are correct.`;
      processError(ex, errorMessage);
    }
  },
};

(async () => {
  if (OPTIONS.SHOW_HELP) help();
  if (OPTIONS.SHOW_VERSION) version();
  checkDependencies();
  const { workspace, commits, getFiles } = await setup();
  const selectedCommits = await askSelectCommits(commits);
  messages.start({ text: 'Get changed files' });
  const filesPerCommit = await Promise.all(
    selectedCommits.map(async commit => ({
      commit,
      files: await getFiles(commit),
    })),
  );
  messages.success();
  const selectedFilesPerCommit = await askWhichFiles(filesPerCommit);
  const credentials = await askSFTPCredentials();
  workflows[OPTIONS.COMMAND]({
    credentials,
    projectPath: `${WORKSPACE_PATH}/${workspace}`,
    filesPerCommit: selectedFilesPerCommit,
  });
})();
