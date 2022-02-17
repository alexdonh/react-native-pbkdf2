# react-native-pbkdf2

PBKDF2 implementation for React Native

* 🔨 Android and iOS native support
* 🎨 Supports SHA-1, SHA-256, SHA-512

## Installation

```sh
npm install react-native-pbkdf2@alexdonh/react-native-pbkdf2#master
```

## Usage

```js
import {pbkdf2, pbkdf2Sync} from 'react-native-pbkdf2';

const password = 'cGFzc3dvcmQ=';
const salt = 'c2FsdA==';
const numberIterations = 1000;
const keyLength = 16;
const derived = await pbkdf2(password, salt, numberIterations, keyLength, 'sha512');
// derived is a buffer

// with callback
pbkdf2(password, salt, numberIterations, keyLength, 'sha512', (err, derived) => {
  // derived is a buffer
});

// sync
const derived = pbkdf2Sync(password, salt, numberIterations, keyLength, 'sha512');

```

## With rn-nodeify

```sh
npx rn-nodeify@alexdonh/rn-nodeify#master --install --yarn --hack
```

Then

```js
import {pbkdf2, pbkdf2Sync} from 'pbkdf2';
// or
import {pbkdf2, pbkdf2Sync} from 'crypto';
```

## License

MIT
