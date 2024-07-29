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
  .option('-v, --verbose', 'show verbose output information')
  .option('-i, --input <value>', 'path to the input file')
  .parse(process.argv);

const options = program.opts();

console.log(figlet.textSync('FireFoo CLI Import/Export'));

console.log(options);

// show help if no options presented
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// check for input and execute
const inputFilePath = options.input;
if (inputFilePath) {
  if (options.verbose) {
    console.log('Verbose output enabled');
  }
  if (!fs.existsSync(inputFilePath)) process.exit(1);

  // start import
}

// async function importFile(path: string) {}
