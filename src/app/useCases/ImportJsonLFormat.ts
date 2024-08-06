import * as admin from 'firebase-admin';
import { firestore } from 'firebase-admin';
import * as fs from 'fs';
import process from 'node:process';
import * as readline from 'readline';
import traverse from 'traverse';
import { FileUtils } from './FileUtils';
import { Logger } from './Logger';
import Timestamp = firestore.Timestamp;

export class ImportJsonLFormat {
  private readonly _idKey = '__id__';
  private readonly _pathKey = '__path__';
  private readonly _exportPathKey = '__exportPath__';

  public async import(filePath: string) {
    try {
      FileUtils.checkFile(filePath);
    } catch (e) {
      const error = e as Error;
      Logger.logErrorMessage(error.message);
      Logger.logImportFailed();
      process.exit(1);
    }

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
      let exportPath;
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
          case this._exportPathKey:
            exportPath = jsonObject[key];
            delete jsonObject[key];
            if (exportPath) {
              throw Error('exportPath not yet supported');
            }
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
          Logger.logInfo(`Wrote document at path: ${collectionPath}`);
        } else {
          Logger.logInfo(`Failed to write document at path: ${collectionPath}`);
        }
      }
    });
  }
}
