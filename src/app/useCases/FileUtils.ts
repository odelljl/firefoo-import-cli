import fs from 'fs';
import path from 'path';

export class FileUtils {
  public static checkFile(
    filePath: string,
    extension: string | null = null,
  ): void {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${filePath} does not exist`);
    }

    const fileStats = fs.statSync(filePath);
    if (fileStats.size === 0) {
      throw new Error(`File ${filePath} is empty`);
    }

    if (extension !== null) {
      const ext = path.extname(filePath);
      if (ext.toLowerCase() !== extension) {
        throw new Error(
          `File extension for file ${filePath} is not ${extension}`,
        );
      }
    }
  }
}
