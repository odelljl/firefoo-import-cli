export abstract class Logger {
  public static logInfo(message: string) {
    console.log('\x1b[33m', `\t${message}`);
  }

  public static logError(err: string) {
    console.log('\x1b[31m', err);
  }

  public static logSuccess(err: string) {
    console.log('\x1b[32m', err);
  }

  public static logImportFailed() {
    this.logError('\nImport failed.');
  }

  public static logImportCompleted() {
    this.logSuccess('\nImport complete.');
  }
}
