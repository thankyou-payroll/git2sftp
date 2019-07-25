import Client from 'ssh2-sftp-client';
import { each } from 'awaity/esm';
import { CONSTANTS, getDirectory } from './helpers';
import messages from './messages';

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

const createFolderStructure = async ({ files, destPath }) => {
  const dirs = files
    .filter(({ status }) => status === 'A')
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

const processFiles = async ({ files, destPath, projectPath }) => {
  await each(files, async ({ status, file }) => {
    messages.start({ text: `${CONSTANTS.STATUS[status]} ${file}` });
    try {
      switch (status) {
        case 'A':
        case 'M':
          await uploadFile({ filePath: file, destPath, projectPath });
          break;
        case 'D':
          await removeFile({ filePath: file, destPath });
          break;
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
  port,
  username,
  password,
  destPath = '/app',
}) => {
  messages.start({ text: 'Deploy' });

  try {
    await connect({ hostname, port, username, password });
    await createFolderStructure({ files, destPath });
    await processFiles({ files, destPath, projectPath });
    messages.success('Deployed');
  } catch (err) {
    console.error(err);
    messages.fail();
    throw err;
  } finally {
    await disconnect();
  }
};

export { deploy };
