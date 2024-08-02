# FireFoo CLI Import

This utility imports data exported from the FireFoo desktop tool in its JSONL format.

## Newline-Separated JSONL File Imports

This utility imports data exported in JSONL format. Why?

- There is no limit to the number of documents that can be imported. JSON
  imports
  would likely require the entire file to be loaded in memory.
- They are easier to deal with, as FireFoo has essentially flattened the object
- tree ahead of time.

## Limitations and Future Feature Possibilities

- Currently, supports `__time__` datatype. There are others could add TBD as
  needed:
  [Data Types](https://www.firefoo.app/docs/firestore-export-import/collection-documents-export-json#data-types).
- Batch/transaction support is not yet implemented.

## Helpful Links

- [Building a TypeScript CLI with Node.js and Commander](https://blog.logrocket.com/building-typescript-cli-node-js-commander)
- [Getting Started with Firefoo](https://www.firefoo.app/docs/getting-started)
- [Export JSON from Firebase Firestore (FireFoo)](https://www.firefoo.app/docs/firestore-export-import/collection-documents-export-json#data-types)
- [Commander (npm)](https://www.npmjs.com/package/commander)
- [travers (npm)](https://www.npmjs.com/package/traverse)
- [Advanced: Authenticate with Firebase in Node.js (Firebase Docs)](https://firebase.google.com/docs/auth/web/google-signin#expandable-3)
