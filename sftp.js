import Client from 'ssh2-sftp-client';
import { each } from 'awaity/esm';
import { CONSTANTS, getDirectory } from './helpers';
import messages from './messages';

const { CODES, LABELS } = CONSTANTS.GIT_STATUS;

// Constants
const TYPES = { '-': 'file', d: 'directory', l: 'link' };

const sftp = new Client();

const getPathType = async path => {
  const type = await sftp.exists(path);
  return TYPES[type];
};

const exists = async path => !!(await getPathType(path));

const makeFolder = async path => {
  const shouldCreate = !(await exists(path));
  if (shouldCreate) await sftp.mkdir(path, true);
};

const createFolderStructure = async ({ files, destPath, isRollback }) => {
  const dirs = files
    .filter(({ status }) => status === (isRollback ? CODES.DELETE : CODES.ADD))
    .map(({ file }) => getDirectory(file));
  messages.start({ text: 'Create folder structure' });
  try {
    await each(dirs, async dir => await makeFolder(`${destPath}/${dir}`));
    messages.success();
  } catch (err) {
    console.error(err);
    messages.fail();
    throw err;
  }
};

const uploadFile = ({ filePath, destPath, projectPath }) =>
  sftp.fastPut(`${projectPath}/${filePath}`, `${destPath}/${filePath}`);

const removeFile = async ({ filePath, destPath }) => {
  const shouldRemove = await exists(`${destPath}/${filePath}`);
  if (shouldRemove) await sftp.delete(`${destPath}/${filePath}`);
};

const deployChange = async ({ status, file, destPath, projectPath }) => {
  switch (status) {
    case CODES.ADD:
    case CODES.MODIFY:
      await uploadFile({ filePath: file, destPath, projectPath });
      break;
    case CODES.DELETE:
      await removeFile({ filePath: file, destPath });
      break;
  }
};
const rollbackChange = async ({ status, file, destPath, projectPath }) => {
  switch (status) {
    case CODES.DELETE:
    case CODES.MODIFY:
      await uploadFile({ filePath: file, destPath, projectPath });
      break;
    case CODES.ADD:
      await removeFile({ filePath: file, destPath });
      break;
  }
};

const processFiles = async ({ files, destPath, projectPath, isRollback }) => {
  await each(files, async ({ status, file }) => {
    try {
      if (isRollback) {
        const rollbackStatus =
          status === CODES.ADD
            ? CODES.DELETE
            : status === CODES.DELETE
            ? CODES.ADD
            : CODES.MODIFY;
        messages.start({ text: `${LABELS[rollbackStatus]} ${file}` });
        await rollbackChange({ status, file, destPath, projectPath });
      } else {
        messages.start({ text: `${LABELS[status]} ${file}` });
        await deployChange({ status, file, destPath, projectPath });
      }
      messages.success();
    } catch (err) {
      console.error(err);
      messages.fail();
      throw err;
    }
  });
};

const connect = ({ hostname, port, username, password }) =>
  sftp.connect({ host: hostname, port, username, password });
const disconnect = () => sftp.end();

const deploy = async ({
  projectPath,
  files,
  hostname,
  port = 22,
  username,
  password,
  destPath = '/app',
  isRollback,
}) => {
  messages.start({ text: isRollback ? 'Rollback' : 'Deploy' });
  try {
    await connect({ hostname, port, username, password });
    await createFolderStructure({ files, destPath, isRollback });
    await processFiles({ files, destPath, projectPath, isRollback });
    messages.success(isRollback ? 'Rolled back' : 'Deployed');
  } catch (err) {
    console.error(err);
    messages.fail();
    throw err;
  } finally {
    await disconnect();
  }
};

export { deploy };
