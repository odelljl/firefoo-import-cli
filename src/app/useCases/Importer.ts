import { firestore } from 'firebase-admin';
import { Meta } from './entities/meta';
import CollectionReference = firestore.CollectionReference;

export class Importer {
  public async import(json: any) {
    const meta = json.meta as Meta;

    // todo: override from command line
    // todo: also override top level collection name
    // const projectId = meta.projectId;
    //
    // if (!projectId) {
    //   logError(`File ${path} does not have the required projectId.`);
    //   logImportFailed();
    //   process.exit(3);
    // }

    // just establishing connectivity
    const resourcePath = meta.resourcePath as string[];

    // @ts-ignore - we check this inFileEnumerator
    await this.loadCollection(resourcePath, json.data);
  }

  private async loadCollection(resourcePath: string[], jsonCollection: any) {
    const firestorePathString = resourcePath.join('/');
    const collectionRef = firestore().collection(firestorePathString);

    for (const key in jsonCollection) {
      const doc = jsonCollection[key];

      const subCollections = doc.__collections__;
      delete doc.__collections__;

      await collectionRef.doc(key).set(doc);

      if (subCollections) {
        for (const subCollectionName in subCollections) {
          await this.loadSubCollection(
            collectionRef,
            key,
            subCollectionName,
            subCollections[subCollectionName],
          );
        }
      }
    }
  }

  private async loadSubCollection(
    collection: CollectionReference,
    id: string,
    subCollectionName: string,
    jsonCollection: any,
  ) {
    const collectionRef = collection.doc(id).collection(subCollectionName);

    for (const key in jsonCollection) {
      const doc = jsonCollection[key];

      const subCollections = doc.__collections__;
      delete doc.__collections__;

      await collectionRef.doc(key).set(doc);

      if (subCollections) {
        for (const subCollectionName in subCollections) {
          await this.loadSubCollection(
            collectionRef,
            key,
            subCollectionName,
            jsonCollection[subCollectionName],
          );
        }
      }
    }
  }
}
