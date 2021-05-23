import * as fs from 'fs';
import * as path from 'path';
import * as stream from 'stream';
import { glob } from 'glob';
import { ISchemasCodegenArgs } from './types';
import { removeDir, writeLines } from './utils';
import { generateTS } from './generate-ts';
import { generateTest } from './generate-test';

const outputDir: string = path.resolve('src');
const inputGlob: string = 'schemas/**/*.json';
const schemaFiles: string[] = glob.sync(inputGlob);
const stderr: stream.Writable = process.stderr;
const stdout: stream.Writable = process.stdout;

stdout.write(`Converting ${schemaFiles.length} schema files from ${inputGlob}\n`);

removeDir(outputDir);

schemaFiles.sort().forEach((inputFile) => {
  try {
    const args: ISchemasCodegenArgs = {
      inputFile,
      tsFilePath: '',
      testFilePath: '',
      documentURI: '',
      import: [],
      base: 'https://schemas.body.link/',
      importHashLength: 0,
      importHashAlgorithm: 'sha256',
      maskNull: false,
      strict: false,
    };

    const inputSchema = JSON.parse(fs.readFileSync(path.resolve(inputFile), 'utf-8'));

    const [documentURI] = (inputSchema.$id ?? 'file://'.concat(path.resolve(inputFile))).split('#');
    args.documentURI = documentURI;

    if (!documentURI.startsWith(args.base)) {
      stderr.write(`Document URI ${documentURI} is outside of output base\n`);
    }

    const [relativeP] = documentURI.slice(args.base.length).split('.json');
    const tsFilePath = path.join(outputDir, relativeP.concat('.ts'));
    const testFilePath = path.join(outputDir, relativeP.concat('.test.ts'));

    args.tsFilePath = tsFilePath;
    args.testFilePath = testFilePath;
    args.documentURI = documentURI;

    stdout.write(`Generating ${tsFilePath}\n`);
    writeLines(tsFilePath, generateTS(inputSchema, args, stderr));

    stdout.write(`Generating ${testFilePath}\n`);
    writeLines(testFilePath, generateTest(args));
  } catch (e) {
    stderr.write(`Crashed while processing ${path.resolve(inputFile)}\n`);
    throw e;
  }
});
