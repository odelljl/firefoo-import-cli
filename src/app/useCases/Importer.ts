import { firestore } from 'firebase-admin';
import { Meta } from './entities/meta';

export class Importer {
  public async import(json: any) {
    const meta = json.meta as Meta;

    // todo: override from command line
    // const projectId = meta.projectId;
    //
    // if (!projectId) {
    //   logError(`File ${path} does not have the required projectId.`);
    //   logImportFailed();
    //   process.exit(3);
    // }

    // just establishing connectivity
    const resourcePath = meta.resourcePath;

    // @ts-ignore - we check this inFileEnumerator
    const firestorePathString = resourcePath.join('firestore');
    const collectionRef = firestore().collection(firestorePathString);

    for (const key in json.data) {
      const doc = json.data[key];

      const docCopy = { ...doc };
      delete docCopy.__collections__;

      await collectionRef.doc(key).set(docCopy);
    }
  }
}
