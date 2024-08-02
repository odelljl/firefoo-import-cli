# FireFoo CLI Import

This utility imports data exported from FireFoo in it's JSONL format.

## Newline-Separated JSONL File Imports

This utility imports data exported in JSONL format. Why?

- There is no limit to the number of documents that can be imported. JSON imports
  would likely require the entire file to be loaded in memory.
- They are easier to deal with, as FireFoo has

Notes

- Review documents with no data, just sub-collections, to see how they behave.
- Document [Data Types](https://www.firefoo.app/docs/firestore-export-import/collection-documents-export-json#data-types) and test all of them.
