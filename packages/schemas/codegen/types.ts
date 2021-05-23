import * as gen from 'io-ts-codegen';
import { JSONSchema7, JSONSchema7Definition, JSONSchema7Type } from 'json-schema';
import { TOption } from '@body-link/type-guards';

export interface ISchemasCodegenArgs {
  inputFile: string;
  tsFilePath: string;
  testFilePath: string;
  documentURI: string;
  import: string[];
  base: string;
  importHashLength: number;
  importHashAlgorithm: string;
  strict: boolean;
  maskNull: boolean;
}

export interface ISchemasCodegenDef {
  typeName: string;
  title: string;
  description: string;
  examples: unknown[];
  defaultValue: unknown;
  staticType: string;
  runtimeType: string;
}

export type TSchemasCodegenExamples = unknown[];

export interface ISchemasCodegenDefMeta {
  title: JSONSchema7['title'];
  description: JSONSchema7['description'];
  examples: TSchemasCodegenExamples;
  defaultValue: JSONSchema7['default'];
}

export interface ISchemasCodegenDefInput {
  meta: ISchemasCodegenDefMeta;
  dec: gen.TypeDeclaration;
}

export interface ISchemasCodegenGenRefs {
  defaultExport: string;
  extractExamples: (schema: JSONSchema7Definition) => TSchemasCodegenExamples;
  extractDefaultValue: (schema: JSONSchema7Definition) => TOption<JSONSchema7Type>;
  imps: Set<string>;
  exps: Set<string>;
  fromSchema: (schema: JSONSchema7Definition, isRoot?: boolean) => gen.TypeReference;
  generateChecks: (jx: string, schema: JSONSchema7) => string;
  warning: (msg: string) => void;
}
