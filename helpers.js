const getHash = commit => commit.match(/([^ ]+) .*/)[1];

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

const getFileName = filePath => filePath.split('/').pop();

const getDirectory = pipe(
  filePath => filePath.split('/'),
  pathArray => pathArray.pop() && pathArray.join('/'),
);

const GIT_STATUS_CODES = { ADD: 'A', MODIFY: 'M', DELETE: 'D' };
const GIT_STATUS_LABELS = {
  [GIT_STATUS_CODES.ADD]: 'ADD',
  [GIT_STATUS_CODES.MODIFY]: 'MODIFY',
  [GIT_STATUS_CODES.DELETE]: 'DELETE',
};

const CONSTANTS = {
  NEW: 'new',
  GIT_STATUS: { CODES: GIT_STATUS_CODES, LABELS: GIT_STATUS_LABELS },
};

module.exports = { CONSTANTS, pipe, getHash, getFileName, getDirectory };
