import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { encrypt, decrypt } from './crypt';

const FILE_OPTIONS = { encoding: 'utf-8' };

const exists = path => existsSync(path);
const get = path => JSON.parse(decrypt(readFileSync(path, FILE_OPTIONS)));
const save = async (path, data) =>
  writeFileSync(path, encrypt(JSON.stringify(data)), FILE_OPTIONS);
const remove = path => unlinkSync(path);

export default { exists, get, save, remove };
