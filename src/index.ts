import { NativeModules } from 'react-native';
import { Buffer } from 'safe-buffer';

type BinaryLike = string | NodeJS.ArrayBufferView;

const MAX_ALLOC = Math.pow(2, 30) - 1; // default in iojs

function toBuffer(
  input: BinaryLike,
  encoding: BufferEncoding = 'utf8',
  name?: string
): Buffer {
  if (Buffer.isBuffer(input)) {
    return input;
  } else if (typeof input === 'string') {
    return Buffer.from(input, encoding);
  } else if (ArrayBuffer.isView(input)) {
    return Buffer.from(input.buffer);
  } else {
    throw new TypeError(
      name ||
        'Input' + ' must be a string, a Buffer, a typed array or a DataView'
    );
  }
}

function pbkdf2(
  password: BinaryLike,
  salt: BinaryLike,
  iterations: number,
  keylen: number,
  digest: 'sha1' | 'sha256' | 'sha512'
): Promise<Buffer>;
function pbkdf2(
  password: BinaryLike,
  salt: BinaryLike,
  iterations: number,
  keylen: number,
  digest: 'sha1' | 'sha256' | 'sha512',
  callback: (err: Error | null, derivedKey?: Buffer) => void
): void;
function pbkdf2(
  password: BinaryLike,
  salt: BinaryLike,
  iterations: number,
  keylen: number,
  digest: 'sha1' | 'sha256' | 'sha512',
  callback?: (err: Error | null, derivedKey?: Buffer) => void
): Promise<Buffer> | void {
  if (iterations < 0) {
    throw new TypeError('Bad iterations');
  }
  if (keylen < 0 || keylen > MAX_ALLOC || keylen !== keylen) {
    /* eslint no-self-compare: 0 */
    throw new TypeError('Bad key length');
  }

  password = toBuffer(password, 'utf8', 'Password').toString('base64');
  salt = toBuffer(salt, 'utf8', 'Salt').toString('base64');

  if (!callback) {
    return NativeModules.Pbkdf2.derive(
      password,
      salt,
      iterations,
      keylen,
      digest
    ).then((derivedKey: any) => Buffer.from(derivedKey, 'base64'));
  }

  NativeModules.Pbkdf2.derive(password, salt, iterations, keylen, digest)
    .then((derivedKey: string) => {
      callback(null, Buffer.from(derivedKey, 'base64'));
    })
    .catch((err: any) => {
      callback(err);
    });
}

function pbkdf2Sync(
  password: BinaryLike,
  salt: BinaryLike,
  iterations: number,
  keylen: number,
  digest: 'sha1' | 'sha256' | 'sha512'
): Buffer {
  if (iterations < 0) {
    throw new TypeError('Bad iterations');
  }
  if (keylen < 0 || keylen > MAX_ALLOC || keylen !== keylen) {
    /* eslint no-self-compare: 0 */
    throw new TypeError('Bad key length');
  }

  password = toBuffer(password, 'utf8', 'Password').toString('base64');
  salt = toBuffer(salt, 'utf8', 'Salt').toString('base64');

  let output: string = '';
  let wait = true;
  NativeModules.Pbkdf2.derive(password, salt, iterations, keylen, digest)
    .then((derivedKey: string) => {
      output = derivedKey;
    })
    .finally(() => {
      wait = false;
    });
  while (wait) {}
  return Buffer.from(output, 'base64');
}

export { pbkdf2, pbkdf2Sync };
