#! /usr/bin/env node

import { Command } from 'commander';
import figlet from 'figlet';
import admin from 'firebase-admin';
import * as process from 'node:process';
import { FileEnumerator } from './app/useCases/FileEnumerator';
import { Importer } from './app/useCases/Importer';
import { Logger } from './app/useCases/Logger';

// parse program options
const program = new Command();

program
  .description(
    'CLI for importing files into FireBase as exported from the FireFoo utility',
  )
  .requiredOption('-i, --inputFile <filePath>', 'path to the input file')
  .requiredOption('-u, --databaseUrl <url>', 'firestore database url')
  .requiredOption(
    '-c, --credentialFilePath <filePath>',
    'path to the credentials file',
  )
  .option(
    '-p, --projectId <value>',
    'override firebase project id in import file',
  )
  .option(
    '-n, --topCollectionName <value>',
    'override to level collection id in import file',
  )
  .option('-t, --useTransaction', 'use a transaction', false)
  .option('-s, --silent', 'do not confirm before importing', false)
  .version('1.0.0') // -V by default, short circuits any further processing
  .parse(process.argv);

const options = program.opts();

console.log(figlet.textSync('FireFoo Import CLI'));

// show help if no options presented
if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}

const inputFilePath = options.inputFile;

//
//
// if (inputFilePath) {
//   // if (options.verbose) {
//   //   console.log('Verbose output enabled');
//   // }
//
//   // check for input and execute
//   if (!fs.existsSync(inputFilePath)) {
//     Logger.logError(`File ${inputFilePath} does not exist`);
//     Logger.logImportFailed();
//     process.exit(1);
//   }

// todo: validate and move
const databaseUrl = options.databaseUrl;
const projectId = options.projectId;
const credentialFilePath = options.credentialFilePath;

initFirebase(credentialFilePath, databaseUrl, projectId);

// start import
// eslint-disable-next-line @typescript-eslint/no-explicit-any
importFile()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .then((_) => Logger.logImportCompleted())
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .catch((_) => {
    Logger.logImportFailed();
    process.exit(1);
  });

// FUNCTIONS

async function importFile() {
  const json = await FileEnumerator.enumerateFile(inputFilePath);

  const importer = new Importer();
  await importer.import(json);
}

function initFirebase(
  credentialFilePath: string,
  databaseUrl: string,
  projectId: string,
) {
  //todo: sort this all out
  process.env['FIREBASE_AUTH_EMULATOR_HOST'] = '127.0.0.1:9099';
  process.env['FIRESTORE_EMULATOR_HOST'] = '127.0.0.1:8080';
  process.env['FIREBASE_STORAGE_EMULATOR_HOST'] = '127.0.0.1:9199';
  try {
    admin.initializeApp({
      credential: admin.credential.cert(credentialFilePath),
      databaseURL: databaseUrl,
      projectId: projectId,
    });
  } catch (e) {
    const error = e as Error;
    Logger.logError(error.message);
  } // Only initialize firebase once
}
