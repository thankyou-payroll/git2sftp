const getHash = commit => commit.match(/([^ ]+) .*/)[1];

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

const getFileName = filePath => filePath.split('/').pop();

const getDirectory = pipe(
  filePath => filePath.split('/'),
  pathArray => pathArray.pop() && pathArray.join('/'),
);

const CONSTANTS = {
  NEW: 'new',
  STATUS: { A: 'ADD', M: 'MODIFY', D: 'DELETE' },
};

export { CONSTANTS, pipe, getHash, getFileName, getDirectory };
