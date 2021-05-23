import * as fs from 'fs';
import * as path from 'path';
import { getDefaultExport } from './utils';
import { ISchemasCodegenArgs } from './types';

const REGEX: RegExp = /^\/\/ FOR_TEST:(\w+):(\[.+\])/gm;

export function* generateTest(args: ISchemasCodegenArgs): Generator<string, void, undefined> {
  const tsFileContent = fs.readFileSync(args.tsFilePath, 'utf-8');
  const [fileName] = args.tsFilePath.split(path.sep).reverse();
  const codecName = getDefaultExport(args.inputFile);
  const tsName = `${codecName}_`;
  const testMatchArrays = [...tsFileContent.matchAll(REGEX)];

  if (testMatchArrays.length === 0) {
    throw new Error(
      `Schema should contain at least one example or default value\nSchema path: ${args.inputFile}`
    );
  }

  yield '/*';
  yield '';
  yield '!!! AUTO GENERATED REFRAIN FROM MANUAL EDITING !!!';
  yield '';
  yield '*/';
  yield '';
  yield "import { validator } from 'io-ts-validator';";
  yield "import { nonEmptyArray } from 'io-ts-types/lib/nonEmptyArray';";
  yield `import * as ${tsName} from './${fileName.slice(0, fileName.length - 3)}';`;
  yield '';

  const mapTypeNameToRefs = testMatchArrays.reduce<Record<string, unknown[]>>((acc, [, typeName, refs]) => {
    acc[typeName] = (acc[typeName] ?? []).concat(JSON.parse(refs));
    return acc;
  }, {});

  const tests = Object.entries(mapTypeNameToRefs).flatMap(([typeName, refs]) => [
    `  it('should decode into ${typeName}', () => {`,
    `    const input = ${JSON.stringify(refs, undefined, 2)};`,
    `    const output = validator(nonEmptyArray(${tsName}.${typeName})).decodeSync(input);`,
    `    return expect(output).toEqual(input);`,
    `  });`,
    '',
  ]);

  yield `describe('Test ${fileName} against schema examples and defaults', () => {`;
  yield '';
  yield* tests;
  yield '';
  yield '});';
}
