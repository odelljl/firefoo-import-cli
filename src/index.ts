#! /usr/bin/env node

import { Command } from 'commander';
import figlet from 'figlet';
import admin from 'firebase-admin';
import * as process from 'node:process';
import { ImportJsonLFormat } from './app/useCases/ImportJsonLFormat';
import { Logger } from './app/useCases/Logger';

displayProgramHeader();

// define program options
const program = new Command();
const options = buildCommandLineOptions('firefoocli');

// show help if no options entered on command line
if (process.argv.slice(2).length == 0) {
  program.outputHelp();
  process.exit(0);
}

// evaluate the command line
program.parse(process.argv);

const inputFilePath = options.inputFile;

// todo: validate these three values
const credentialFilePath = options.credentialFilePath;
const useEmulator = options.useEmulator;
const databaseUrl = options.databaseUrl;

const isVerbose = !options.silent;

Logger.setVerbose(isVerbose);

initFirebase(credentialFilePath, databaseUrl, useEmulator);

// start import use case
importJsonLFile()
  .then(() => {
    Logger.logImportCompleted();
  })
  .catch((error) => {
    Logger.logError(error);
    Logger.logImportFailed();
    process.exit(1);
  });

// local functions

function displayProgramHeader() {
  console.log(figlet.textSync('FireFoo Import CLI'));
}

function buildCommandLineOptions(programName: string) {
  program
    .name(programName)
    .usage('-i <filePath> -c <filePath> [options]')
    .description(
      'CLI for importing JSONL files as exported form the FireFoo utility.',
    )
    .helpOption('-h, --help', 'display help for the cli and exit')
    .requiredOption(
      '-i, --inputFile <filePath>',
      'required path to the JSONL input file',
    )
    .requiredOption(
      '-c, --credentialFilePath <filePath>',
      'required path to the credentials file',
    )
    .option(
      '-e, --useEmulator <boolean>',
      'indicate whether data is loaded to local emulator.',
      true,
    )
    .option(
      '-u, --databaseUrl <url>',
      'database urlq',
      'http://127.0.0.1:4000/firestore/data',
    )
    .option('-s, --silent', 'optional flag to mute detailed logging', false)
    //todo: get version from external source
    .version('0.0.1', '-v, --version', 'output the cli version and exit');

  return program.opts();
}

function initFirebase(
  credentialFilePath: string,
  databaseUrl: string,
  useEmulator: boolean,
) {
  if (useEmulator) {
    process.env['FIRESTORE_EMULATOR_HOST'] = '127.0.0.1:8080';
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(credentialFilePath),
      databaseURL: databaseUrl,
    });
  } catch (e) {
    const error = e as Error;
    Logger.logError(error);
  }
}

async function importJsonLFile() {
  const importer = new ImportJsonLFormat();
  await importer.import(inputFilePath);
}
