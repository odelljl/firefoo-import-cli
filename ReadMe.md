# FireFoo CLI Import

This utility imports data exported from the FireFoo desktop tool in its JSONL
format.

## Newline-Separated JSONL Files

This utility imports data exported in JSONL format. Why?

- There is no limit to the number of documents that can be imported. JSON
  imports could require the entire file to be loaded in memory.
- JSONL are easier to deal with, as FireFoo has essentially flattened the 
  sub-collection tree for you ahead of time.

## Installation

This package is designed to be used as a development dependency within your
project.

Please install within your project with one of the following commands:

```shell
# npm
npm install @odelljl/firefoocli --save-dev

#yarn
yarn add @odelljl/firefoocli --dev
```

Alternatively, install it globally on your system:

```shell
# npm
npm install @odelljl/firefoocli -g

#yarn
yarn global add @odelljl/firefoocli
```

## Limitations and Future Feature Possibilities

- Currently, supports only the `__time__` special datatype. There are others
  could add TBD as needed: [Data Types](https://www.firefoo.app/docs/firestore-export-import/collection-documents-export-json#data-types).
- Batch/transaction support is not yet implemented.

## Helpful Links

- [Building a TypeScript CLI with Node.js and Commander](https://blog.logrocket.com/building-typescript-cli-node-js-commander)
- [Getting Started with Firefoo](https://www.firefoo.app/docs/getting-started)
- [Export JSON from Firebase Firestore (FireFoo)](https://www.firefoo.app/docs/firestore-export-import/collection-documents-export-json#data-types)
- [Commander (npm)](https://www.npmjs.com/package/commander)
- [travers (npm)](https://www.npmjs.com/package/traverse)
