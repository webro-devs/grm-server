import * as crypto from 'crypto';

function generateId() {
  const randomString = crypto.randomBytes(16 * 2).toString('hex');
  const timestamp = Date.now().toString();
  const hash = crypto.createHash('sha256');
  hash.update(randomString);
  hash.update(timestamp);
  const fullHash = hash.digest('hex');
  return '#' + fullHash.substr(0, 11);
}

export default generateId;
