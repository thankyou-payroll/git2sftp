import secureFile from './secure-file';
import { resolve } from 'path';
const CREDENTIALS_PATH = resolve(process.cwd(), '.creds');

const exists = () => secureFile.exists(CREDENTIALS_PATH);
const getCredentials = () => secureFile.get(CREDENTIALS_PATH);
const list = () => Object.keys(getCredentials());
const get = hostname => {
  const credentials = getCredentials();
  return credentials[hostname];
};
const save = ({ hostname, port, username, password, destPath }) => {
  const credentials = exists() ? getCredentials() : {};
  credentials[hostname] = { port, username, password, destPath };
  return secureFile.save(CREDENTIALS_PATH, credentials);
};

export default { exists, get, save, list };
