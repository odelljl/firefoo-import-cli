export abstract class Logger {
  private static _isVerbose = false;

  public static logInfo(message: string) {
    if (this._isVerbose) console.log('\x1b[33m', `\t${message}`);
  }

  public static logError(err: Error) {
    console.log('\x1b[31m', err);
  }

  public static logErrorMessage(errorMessage: string) {
    console.log('\x1b[31m', errorMessage);
  }

  public static logSuccess(err: string) {
    console.log('\x1b[32m', err);
  }

  public static logImportFailed() {
    this.logErrorMessage('\nImport failed.');
  }

  public static logImportCompleted() {
    this.logSuccess('\nImport complete.');
  }

  public static setVerbose(verbose: boolean) {
    Logger._isVerbose = verbose;
  }
}
