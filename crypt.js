import crypto from 'crypto';
import { ENCRYPTION } from './config';

const { PREFIX, KEY, ALGORITHM, IV_LENGTH } = ENCRYPTION;

const FINAL_KEY = `${KEY}${PREFIX.repeat(10)}${KEY}`.slice(-32);

const encrypt = text => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(FINAL_KEY), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

const decrypt = text => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(FINAL_KEY),
    iv,
  );
  const decrypted = decipher.update(encryptedText);
  return Buffer.concat([decrypted, decipher.final()]).toString();
};

export { decrypt, encrypt };
