import secureFiles from './secure-files';
import { resolve } from 'path';
const CREDENTIALS_PATH = resolve(process.cwd(), '.creds');

const exists = () => secureFiles.exists(CREDENTIALS_PATH);
const get = () => secureFiles.get(CREDENTIALS_PATH);

const save = ({ hostname, port, username, password, destPath }) =>
  secureFiles.save(CREDENTIALS_PATH, {
    hostname,
    port,
    username,
    password,
    destPath,
  });

export default { exists, get, save };
