import ora from 'ora';

const current = ora();

const start = ({ indent, spinner, color, prefixText, text }) => {
  if (indent) current.indent = indent;
  if (spinner) current.spinner = spinner;
  if (color) current.color = color;
  if (prefixText) current.prefixText = prefixText;
  current.start(text);
};

const end = ({ type, text, symbol, prefixText }) => {
  switch (type) {
    case 'info':
      current.info(text);
      break;
    case 'warn':
      current.warn(text);
      break;
    case 'fail':
      current.fail(text);
      break;
    case 'succeed':
      current.succeed(text);
      break;
    default:
      current.stopAndPersist({ symbol, prefixText, text });
  }
};

const success = text => end({ type: 'succeed', text });
const fail = text => end({ type: 'fail', text });

export default { start, end, success, fail };
