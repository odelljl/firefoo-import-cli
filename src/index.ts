#! /usr/bin/env node

import { Command } from 'commander';
import figlet from 'figlet';
import admin from 'firebase-admin';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { FileUtils } from './app/useCases/FileUtils';
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

// todo: validate these two values
const useEmulator = options.useEmulator;
const databaseUrl = options.databaseUrl;

// use specific credentials if supplied
const credentialFilePath = options.credentialFilePath;

if (credentialFilePath) {
  try {
    FileUtils.checkFile(credentialFilePath);
  } catch (e) {
    const error = e as Error;
    Logger.logErrorMessage(error.message);
    Logger.logImportFailed();
    process.exit(1);
  }
}

initFirebase(credentialFilePath, databaseUrl, useEmulator);

const isVerbose = !options.silent;
Logger.setVerbose(isVerbose);

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
      '-i, --inputFile <inputFilePath>',
      'required path to the JSONL input file',
    )
    .option(
      '-c, --credentialFilePath <credential1sfilePath>',
      'required path to the credentials file',
    )
    .option(
      '-e, --useEmulator <boolean>',
      'indicate whether data is loaded to local emulator',
      true,
    )
    .option(
      '-u, --databaseUrl <url>',
      'database url',
      'http://127.0.0.1:4000/firestore/data',
    )
    .option('-s, --silent', 'optional flag to mute detailed logging', false);

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
    if (credentialFilePath) {
      initializeApp({
        credential: admin.credential.cert(credentialFilePath),
        databaseURL: databaseUrl,
      });
    } else {
      const credential = applicationDefault();
      initializeApp({
        credential: credential,
        databaseURL: databaseUrl,
        projectId: 'default',
      });
    }
  } catch (e) {
    const error = e as Error;
    Logger.logError(error);
  }
}

async function importJsonLFile() {
  const importer = new ImportJsonLFormat();
  await importer.import(inputFilePath);
}
