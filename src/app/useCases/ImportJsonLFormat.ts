import { firestore } from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as admin from 'firebase-admin';
import traverse from 'traverse';
import { Logger } from './Logger';
import Timestamp = firestore.Timestamp;

export class ImportJsonLFormat {
  private readonly _idKey = '__id__';
  private readonly _pathKey = '__path__';

  public async import(filePath: string) {
    this.checkFile(filePath);

    const db = admin.firestore();

    const readInterface = readline.createInterface({
      input: fs.createReadStream(filePath),
    });

    readInterface.on('error', (err) => {
      Logger.logError(err);
    });

    readInterface.on('line', async (line) => {
      const jsonObject = JSON.parse(line);

      // get the path and docId
      let docId;
      let collectionPath;
      for (const key in jsonObject) {
        switch (key) {
          case this._pathKey:
            collectionPath = jsonObject[key];
            delete jsonObject[key];
            break;
          case this._idKey:
            docId = jsonObject[key];
            delete jsonObject[key];
            break;
          default:
            break;
        }
      }

      if (!(collectionPath && docId)) {
        throw new Error(
          `Missing critical firestore field(s). Path: ${collectionPath}, ID: ${docId}`,
        );
      } else {
        const docObject = traverse(jsonObject).map(function (value) {
          // peek ahead to see if there is a  special field.
          // replace with the appropriate value for import
          if (value !== null && value.hasOwnProperty('__time__')) {
            const dateTime = new Date(Date.parse(value.__time__));
            const fireStoreTimestamp = Timestamp.fromDate(dateTime);
            this.update(fireStoreTimestamp);
          }
        });

        const result = await db.doc(collectionPath).set(docObject);

        if (result) {
          Logger.logInfo(`Wrote: ${collectionPath}/${docId}`);
        } else {
          Logger.logInfo(`Fail: ${collectionPath}/${docId}`);
        }
      }
    });
  }

  private checkFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new Error('File does not exist');
    }

    const fileStats = fs.statSync(filePath);
    if (fileStats.size === 0) {
      throw new Error('File is empty');
    }

    const ext = path.extname(filePath);
    if (ext.toLowerCase() !== '.jsonl') {
      throw new Error('File extension is not .jsonl');
    }
  }
}
