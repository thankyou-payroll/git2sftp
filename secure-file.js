const { readFileSync, writeFileSync, existsSync, unlinkSync } = require('fs');
const { encrypt, decrypt } = require('./crypt');

const FILE_OPTIONS = { encoding: 'utf-8' };

const exists = path => existsSync(path);
const get = path => JSON.parse(decrypt(readFileSync(path, FILE_OPTIONS)));
const save = async (path, data) =>
  writeFileSync(path, encrypt(JSON.stringify(data)), FILE_OPTIONS);
const remove = path => unlinkSync(path);

module.exports = { exists, get, save, remove };
