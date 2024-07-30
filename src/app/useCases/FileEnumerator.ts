import fs from 'fs';
import process from 'node:process';
import { Meta } from './entities/meta';
import { Logger } from './Logger';

export abstract class FileEnumerator {
  public static async enumerateFile(filePath: string): Promise<any> {
    // check for input and execute
    if (!fs.existsSync(filePath)) {
      Logger.logError(`File ${filePath} does not exist`);
      Logger.logImportFailed();
      process.exit(1);
    }

    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    const json = this.readInJson(fileContent);

    const meta = json.meta as Meta;

    if (!meta) {
      Logger.logError(
        `File '${filePath}' does not have the required meta section.`,
      );
      Logger.logImportFailed();
      process.exit(2);
    }

    const resourcePath = meta.resourcePath;

    if (!resourcePath) {
      Logger.logError(
        `File ${filePath} is missing the required metadata for resourcePath.`,
      );
      Logger.logImportFailed();
      process.exit(5);
    }

    const firestorePathString = resourcePath.join('.');

    Logger.logInfo(`Top level collection: ${firestorePathString}`);

    const data = json.data;

    const keyCount = Object.keys(data).length;
    Logger.logInfo(`Number of objects: ${keyCount}`);

    return json;
  }

  private static readInJson(json: string) {
    try {
      return JSON.parse(json);
    } catch (error) {
      Logger.logError(`Error parsing JSON: ${error}`);
    }
  }
}
