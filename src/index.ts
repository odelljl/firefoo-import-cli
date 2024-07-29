#! /usr/bin/env node

import { Command } from 'commander';
import figlet from 'figlet';
import * as fs from 'fs';

const program = new Command();
program
  .version('1.0.0') // -V by default, short circuits any further processing
  .description(
    'CLI for importing files into FireBase as exported from the FireFoo utility',
  )
  .option('-i, --input <value>', 'path to the input file')
  .parse(process.argv);

const options = program.opts();

console.log(figlet.textSync('FireFoo Import CLI'));

// show help if no options presented
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

const inputFilePath = options.input;
if (inputFilePath) {
  // if (options.verbose) {
  //   console.log('Verbose output enabled');
  // }

  // check for input and execute
  if (!fs.existsSync(inputFilePath)) {
    logError(`File ${inputFilePath} does not exist`);
    logImportFailed();
    process.exit(1);
  }

  // start import
  importFile(inputFilePath)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .then((_) => logImportCompleted())
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((_) => {
      logImportFailed();
      process.exit(1);
    });
}

// FUNCTIONS

async function importFile(path: string) {
  try {
    const fileContent = await fs.promises.readFile(path, 'utf-8');
    console.log(fileContent);
  } catch (error) {
    logImportFailed();
  }
}

function logError(err: string) {
  console.log('\x1b[31m', err);
}

function logSuccess(err: string) {
  console.log('\x1b[32m', err);
}

function logImportFailed() {
  logError('\nImport failed.');
}

function logImportCompleted() {
  logSuccess('\nImport complete.');
}
