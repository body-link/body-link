import * as path from 'path';
import * as crypto from 'crypto';
import * as stream from 'stream';
import * as gen from 'io-ts-codegen';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import {
  ISchemasCodegenArgs,
  ISchemasCodegenDef,
  ISchemasCodegenDefInput,
  ISchemasCodegenDefMeta,
  TSchemasCodegenExamples,
} from './types';
import { printC } from './printc';
import { fromHyper } from './hyper';
import { capitalize, getDefaultExport, typenameFromKebab } from './utils';
import { isDefined, isUndefined } from '@body-link/type-guards';

export function* generateTS(
  inputSchema: JSONSchema7,
  args: ISchemasCodegenArgs,
  stderr: stream.Writable
): Generator<string, void, undefined> {
  type URI = string;
  type Location = string;
  const imports: [URI, Location][] = args.import.map((imp: string) => imp.split('^') as [URI, Location]);

  const genNeverType = gen.intersectionCombinator([
    gen.literalCombinator(true),
    gen.literalCombinator(false),
  ]);

  const genIntersectionCombinator = (combinators: gen.TypeReference[]): [gen.TypeReference] | [] => {
    if (combinators.length > 1) {
      const intersection = gen.intersectionCombinator(combinators);
      return [intersection];
    }
    const [first] = combinators;
    return isDefined(first) ? [first] : [];
  };

  const genUnionCombinator = (combinators: gen.TypeReference[]): [gen.TypeReference] | [] => {
    if (combinators.length > 1) {
      const union = gen.unionCombinator(combinators);
      return [union];
    }
    const [first] = combinators;
    if (typeof first === 'undefined') {
      return [];
    }
    return [first];
  };

  // START: Ajv Schema Helpers https://github.com/epoberezkin/ajv-keywords

  type AjvKeywordsRegexpString = string;
  interface IAjvKeywordsRegexpObject {
    pattern: string;
    flags: string;
  }
  type AjvKeywordsRegexp = AjvKeywordsRegexpString | IAjvKeywordsRegexpObject;

  interface IAjvKeywords {
    regexp: AjvKeywordsRegexp;
  }

  type AjvSchema = JSONSchema7 & IAjvKeywords;

  function isRegexpString(regexp: AjvKeywordsRegexp): regexp is AjvKeywordsRegexpString {
    return typeof regexp === 'string';
  }

  function isRegexpObject(regexp: AjvKeywordsRegexp): regexp is IAjvKeywordsRegexpObject {
    return typeof regexp === 'object';
  }

  function regexpObjectFromString(regexp: AjvKeywordsRegexpString): IAjvKeywordsRegexpObject {
    const pattern = regexp.split('/').slice(1, -1).join('/');
    const [flags] = regexp.split('/').slice(-1);
    if (typeof flags === 'undefined') {
      throw new Error('assert false');
    }
    return { pattern, flags };
  }

  function getRegexpObject(regexp: AjvKeywordsRegexp): IAjvKeywordsRegexpObject {
    if (isRegexpString(regexp)) {
      return regexpObjectFromString(regexp);
    }
    if (isRegexpObject(regexp)) {
      return regexp;
    }
    throw new Error('unknown regexp format');
  }

  // END: Ajv Schema Helpers

  const definedHelper = `
export type Defined = {} | null
export class DefinedType extends t.Type<Defined> {
  readonly _tag: 'DefinedType' = 'DefinedType'
  constructor() {
    super(
      'defined',
      (u): u is Defined => typeof u !== 'undefined',
      (u, c) => (this.is(u) ? t.success(u) : t.failure(u, c)),
      t.identity
    )
  }
}
export interface DefinedC extends DefinedType {}
export const Defined: DefinedC = new DefinedType()
`;

  const Defined = gen.customCombinator('Defined', 'Defined');

  const nullHelper = `
export interface NullBrand {
  readonly Null: unique symbol
}
export type NullC = t.BrandC<t.UnknownC, NullBrand>;
export const Null: NullC = t.brand(
  t.unknown,
  (n): n is t.Branded<unknown, NullBrand> => n === null,
  'Null'
)
export type Null = t.TypeOf<typeof Null>
`;

  const Null = gen.customCombinator('Null', 'Null');

  const supportedEverywhere = [
    '$id',
    '$comment',
    'title',
    'description',
    'definitions',
    'type',
    'properties',
    'propertyNames',
    'patternProperties',
    'required',
    'additionalProperties',
    'allOf',
    'anyOf',
    'oneOf',
    'enum',
    'const',
    'items',
    'contains',
    'additionalItems',
  ];
  const supportedAtRoot = [
    '$schema',
    'minimum',
    'maximum',
    'multipleOf',
    'minLength',
    'maxLength',
    'pattern',
    'regexp',
    'format',
    'minItems',
    'maxItems',
    'uniqueItems',
    'default',
    'examples',
    'links',
  ];
  const supportedOutsideRoot = ['$ref'];

  const documentBase = (() => {
    const [, ...reversePath] = args.documentURI.split('/').reverse();
    return reversePath.reverse().join('/');
  })();

  const defaultExport = getDefaultExport(args.inputFile);

  const imps = new Set<string>();
  const helpers = new Set<string>();
  const exps = new Set<string>();

  enum ErrorCode {
    WARNING = 1,
    ERROR = 2,
  }
  type OK = 0;
  const OK: OK = 0;
  type ReturnCode = OK | ErrorCode;
  let returnCode: ReturnCode = OK;

  function updateFailure(level: ErrorCode): void {
    if (returnCode === ErrorCode.ERROR) {
      return;
    }
    returnCode = level;
  }

  function reportError(level: 'INFO' | 'WARNING' | 'ERROR', message: string): void {
    const lines = [`${level}: ${message}`, `  in ${args.inputFile}`];
    stderr.write(lines.join('\n').concat('\n'));
  }

  function error(message: string): gen.CustomCombinator {
    updateFailure(ErrorCode.ERROR);
    reportError('ERROR', message);
    const escalate = "throw new Error('schema conversion failed')";
    return gen.customCombinator(escalate, escalate);
  }
  function warning(message: string): void {
    updateFailure(ErrorCode.WARNING);
    reportError('WARNING', message);
  }
  function info(message: string): void {
    reportError('INFO', message);
  }

  function notImplemented(item: string, kind: string): void {
    const isOutsideRoot = supportedAtRoot.includes(item);
    const where = isOutsideRoot ? 'outside top-level definitions' : '';
    const message = [item, kind, 'not supported', where].filter((s) => s.length > 0).join(' ');
    warning(message);
  }

  function parseRef(ref: string): {
    filePath: string;
    variableName: string;
  } {
    const parts = ref.split('#');
    if (parts.length === 1) {
      const [filePath] = parts;
      if (typeof filePath === 'undefined') {
        throw new Error('assert false');
      }
      return { filePath, variableName: getDefaultExport(filePath) };
    }
    if (parts.length > 2) {
      throw new Error('unknown ref format');
    }
    const [filePath, jsonPath] = parts;
    if (typeof jsonPath === 'undefined') {
      throw new Error('assert false');
    }
    const jsonPathParts = jsonPath.split('/');
    if (jsonPathParts.length !== 3) {
      throw new Error('unknown ref format');
    }
    const [empty, definitions, name] = jsonPathParts;
    if (empty !== '') {
      throw new Error('unknown ref format');
    }
    if (definitions !== 'definitions') {
      throw new Error('unknown ref format');
    }
    if (typeof name === 'undefined') {
      throw new Error('assert false');
    }
    const variableName = typenameFromKebab(name);
    if (typeof filePath === 'undefined') {
      throw new Error('assert false');
    }
    return { filePath, variableName };
  }

  type JSVar = string;
  type JSBoolean = string;

  function checkFormat(jx: JSVar, format: string): JSBoolean {
    switch (format) {
      case 'ipv4':
        return `( typeof ${jx} !== 'string' || ((octets) => octets.length === 4 && octets.map(Number).every((octet) => Number.isInteger(octet) && octet >= 0x00 && octet <= 0xff))(${jx}.split('.')) )`;
      case 'date-time':
        return `( typeof ${jx} !== 'string' || /^\\d{4}-\\d\\d-\\d\\dT\\d\\d:\\d\\d:\\d\\d(\\.\\d+)?(([+-]\\d\\d:\\d\\d)|Z)?$/.test(${jx}) )`;
      default:
        notImplemented(format, 'format');
        return String(true);
    }
  }

  function checkPattern(jx: JSVar, pattern: string): JSBoolean {
    const stringLiteral = JSON.stringify(pattern);
    return `( typeof ${jx} !== 'string' || ${jx}.match(RegExp(${stringLiteral})) !== null )`;
  }

  function checkRegexp(jx: JSVar, regexp: AjvKeywordsRegexp): JSBoolean {
    const { pattern, flags } = getRegexpObject(regexp);
    const patternLiteral = JSON.stringify(pattern);
    const flagsLiteral = JSON.stringify(flags);
    return `( typeof ${jx} !== 'string' || ${jx}.match(RegExp(${patternLiteral}, ${flagsLiteral})) !== null )`;
  }

  function checkMinLength(jx: JSVar, minLength: number): JSBoolean {
    return `( typeof ${jx} !== 'string' || ${jx}.length >= ${minLength} )`;
  }

  function checkMaxLength(jx: JSVar, maxLength: number): JSBoolean {
    return `( typeof ${jx} !== 'string' || ${jx}.length <= ${maxLength} )`;
  }

  function checkMinimum(jx: JSVar, minimum: number): JSBoolean {
    return `( typeof ${jx} !== 'number' || ${jx} >= ${minimum} )`;
  }

  function checkMaximum(jx: JSVar, maximum: number): JSBoolean {
    return `( typeof ${jx} !== 'number' || ${jx} <= ${maximum} )`;
  }

  function checkMultipleOf(jx: JSVar, divisor: number): JSBoolean {
    return `( typeof ${jx} !== 'number' || ${jx} % ${divisor} === 0 )`;
  }

  function checkInteger(jx: JSVar): JSBoolean {
    return `( Number.isInteger(${jx}) )`;
  }

  function checkMinItems(jx: JSVar, minItems: number): JSBoolean {
    return `( Array.isArray(${jx}) === false || ${jx}.length >= ${minItems} )`;
  }

  function checkMaxItems(jx: JSVar, maxItems: number): JSBoolean {
    return `( Array.isArray(${jx}) === false || ${jx}.length <= ${maxItems} )`;
  }

  function checkUniqueItems(jx: JSVar): JSBoolean {
    return `( Array.isArray(${jx}) === false || ${jx}.length === [...new Set(${jx})].length )`;
  }

  function generateChecks(jx: JSVar, schema: JSONSchema7): JSBoolean {
    const checks: string[] = [
      ...(schema.pattern ? [checkPattern(jx, schema.pattern)] : []),
      ...((schema as AjvSchema).regexp ? [checkRegexp(jx, (schema as AjvSchema).regexp)] : []),
      ...(schema.format ? [checkFormat(jx, schema.format)] : []),
      ...(isDefined(schema.minLength) ? [checkMinLength(jx, schema.minLength)] : []),
      ...(isDefined(schema.maxLength) ? [checkMaxLength(jx, schema.maxLength)] : []),
      ...(isDefined(schema.minimum) ? [checkMinimum(jx, schema.minimum)] : []),
      ...(isDefined(schema.maximum) ? [checkMaximum(jx, schema.maximum)] : []),
      ...(isDefined(schema.multipleOf) ? [checkMultipleOf(jx, schema.multipleOf)] : []),
      ...(schema.type === 'integer' ? [checkInteger(jx)] : []),
      ...(isDefined(schema.minItems) ? [checkMinItems(jx, schema.minItems)] : []),
      ...(isDefined(schema.maxItems) ? [checkMaxItems(jx, schema.maxItems)] : []),
      ...(schema.uniqueItems === true ? [checkUniqueItems(jx)] : []),
    ];
    if (checks.length < 1) {
      return 'true';
    }
    return checks.join(' && ');
  }

  function calculateImportPath(filePath: string): string {
    const [withoutSuffix] = filePath.split('.json');
    if (typeof withoutSuffix === 'undefined') {
      throw new Error('assert false');
    }
    if (withoutSuffix.startsWith(args.base)) {
      const relativePath = path.relative(documentBase, withoutSuffix).split('\\').join('/');
      if (relativePath.startsWith('.')) {
        return relativePath;
      }
      return './'.concat(relativePath);
    }

    for (const [uri, location] of imports) {
      if (withoutSuffix.startsWith(uri)) {
        return location.concat(withoutSuffix.slice(uri.length));
      }
    }
    return './'.concat(withoutSuffix);
  }

  function importBaseName(filePath: string): string {
    const [withoutPath] = filePath.split('/').reverse();
    if (typeof withoutPath === 'undefined') {
      throw new Error('assert false');
    }
    const [basefile] = withoutPath.split('.json');
    if (isUndefined(basefile)) {
      throw new Error('assert false');
    }
    const typeName = typenameFromKebab(basefile);
    return typeName.concat('_');
  }

  function importHashName(refString: string): string {
    if (args.importHashLength === 0) {
      return '';
    }
    const [withoutFragment] = refString.split('#');
    if (typeof withoutFragment === 'undefined') {
      throw new Error('assert false');
    }
    const fullDigest = crypto.createHash(args.importHashAlgorithm).update(withoutFragment).digest('hex');
    const shortDigest = fullDigest.slice(0, args.importHashLength);
    return shortDigest.concat('_');
  }

  function calculateImportName(filePath: string, refString: string): string {
    const baseName = importBaseName(filePath);
    const hashName = importHashName(refString);
    return baseName.concat(hashName);
  }

  type RefObject = JSONSchema7 & { $ref: string };
  function isRefObject(schema: JSONSchema7): schema is RefObject {
    if (!schema.hasOwnProperty('$ref')) {
      return false;
    }
    if (typeof schema.$ref === 'string') {
      return true;
    }
    throw new Error('broken input');
  }

  function fromRef(refObject: RefObject): gen.TypeReference {
    const { $ref: refString } = refObject;

    let ref;
    try {
      ref = parseRef(refString);
    } catch {
      return error('Failed to parse reference');
    }

    if (ref.filePath === '') {
      return gen.customCombinator(ref.variableName, ref.variableName, [ref.variableName]);
    }
    const importName = calculateImportName(ref.filePath, refString);
    const importPath = calculateImportPath(ref.filePath);
    imps.add(`import * as ${importName} from '${importPath}';`);

    const variableRef = `${importName}.${ref.variableName}`;
    return gen.customCombinator(variableRef, variableRef, [importName]);
  }

  function isSupported(feature: string, isRoot: boolean): boolean {
    if (supportedEverywhere.includes(feature)) {
      return true;
    }
    if (isRoot) {
      return supportedAtRoot.includes(feature);
    }
    return supportedOutsideRoot.includes(feature);
  }

  function fromType(schema: JSONSchema7): [gen.TypeReference] | [] {
    if (typeof schema.type === 'undefined') {
      return [];
    }
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];

    const combinators = types.flatMap((t): [gen.TypeReference] | [] => {
      switch (t) {
        case 'string':
          return [gen.stringType];
        case 'number':
        case 'integer':
          return [gen.numberType];
        case 'boolean':
          return [gen.booleanType];
        case 'null':
          if (args.maskNull) {
            helpers.add(nullHelper);
            return [Null];
          }
          return [gen.nullType];
        case 'array':
          if (schema.hasOwnProperty('items')) {
            return []; // trust items validator to validate array
          }
          return [gen.unknownArrayType];
        case 'object':
          if (schema.hasOwnProperty('properties')) {
            return []; // trust properties validator to validate object
          }
          if (schema.hasOwnProperty('patternProperties')) {
            return []; // trust pattern properties validator to validate object
          }
          if (schema.hasOwnProperty('propertyNames')) {
            return []; // trust property names validator to validate object
          }
          if (schema.hasOwnProperty('additionalProperties')) {
            return []; // trust additional properties validator to validate object
          }
          return [gen.unknownRecordType];
        default:
          notImplemented(JSON.stringify(schema.type), 'type');
          return [gen.unknownType];
      }
    });

    return genUnionCombinator(combinators);
  }

  function fromProperties(schema: JSONSchema7): [gen.TypeReference] | [] {
    if ('properties' in schema && typeof schema.properties !== 'undefined') {
      if (schema.type !== 'object') {
        throw new Error(
          'properties keyword is not supported outside explicit object definitions. See https://github.com/maasglobal/io-ts-from-json-schema/issues/33'
        );
      }
      const combinator = gen.partialCombinator(
        Object.entries(schema.properties).map(<K extends string, V>([key, value]: [K, V]) =>
          gen.property(key, fromSchema(value))
        )
      );
      return [combinator];
    }
    return [];
  }

  function fromPropertyNames(schema: JSONSchema7): [gen.TypeReference] | [] {
    if ('propertyNames' in schema && typeof schema.propertyNames !== 'undefined') {
      if (schema.type !== 'object') {
        throw new Error(
          'propertyNames keyword is not supported outside explicit object definitions. See https://github.com/maasglobal/io-ts-from-json-schema/issues/33'
        );
      }

      return [gen.recordCombinator(fromSchema(schema.propertyNames), gen.unknownType)];
    }
    return [];
  }

  function fromPatternProperties(schema: JSONSchema7): [gen.TypeReference] | [] {
    if ('patternProperties' in schema && typeof schema.patternProperties !== 'undefined') {
      if (schema.type !== 'object') {
        throw new Error(
          'patternProperties keyword is not supported outside explicit object definitions. See https://github.com/maasglobal/io-ts-from-json-schema/issues/33'
        );
      }

      // the mapping from pattern to item is lost in the process
      // See https://github.com/microsoft/TypeScript/issues/6579
      warning('patternProperty support has limitations');

      type Pattern = string;

      // The Record must also support non-pattern properties
      const exactPairs = Object.entries(schema.properties ?? {}).map(<V>([key, value]: [string, V]): [
        Pattern,
        V
      ] => [`^${key}$`, value]);
      const fuzzyPairs = Object.entries(schema.patternProperties);
      const allPairs = exactPairs.concat(fuzzyPairs);
      const valueCombinators = allPairs.map(<K extends string, V>([, value]: [K, V]) => fromSchema(value));

      const [valueCombinator] = genUnionCombinator(valueCombinators);
      if (typeof valueCombinator !== 'undefined') {
        return [gen.recordCombinator(gen.stringType, valueCombinator)];
      }
    }
    return [];
  }

  function fromAdditionalProperties(schema: JSONSchema7): [gen.TypeReference] | [] {
    if ('additionalProperties' in schema && typeof schema.additionalProperties !== 'undefined') {
      if (schema.type !== 'object') {
        throw new Error(
          'additionalProperties keyword is not supported outside explicit object definitions. See https://github.com/maasglobal/io-ts-from-json-schema/issues/33'
        );
      }
      if (schema.additionalProperties === false) {
        // avoid problems related to Record<string, never>
        return [];
      }

      return [gen.recordCombinator(gen.stringType, fromSchema(schema.additionalProperties))];
    }
    return [];
  }

  function fromPropertyRules(schema: JSONSchema7): [gen.TypeReference] | [] {
    return genIntersectionCombinator([
      ...fromProperties(schema),
      ...fromPropertyNames(schema),
      ...fromPatternProperties(schema),
      ...fromAdditionalProperties(schema),
    ]);
  }

  function fromRequired(schema: JSONSchema7): [gen.TypeReference] | [] {
    if ('required' in schema && typeof schema.required !== 'undefined') {
      const combinator = gen.typeCombinator(
        schema.required.map((key) => {
          helpers.add(definedHelper);
          return gen.property(key, Defined);
        })
      );
      return [combinator];
    }
    return [];
  }

  function fromObjectKeywords(schema: JSONSchema7): gen.TypeReference[] {
    return [...fromPropertyRules(schema), ...fromRequired(schema)];
  }

  function fromItems(schema: JSONSchema7): [gen.TypeReference] | [] {
    if ('items' in schema && typeof schema.items !== 'undefined') {
      if (schema.type !== 'array') {
        throw new Error(
          'items keyword is not supported outside explicit array definitions. See https://github.com/maasglobal/io-ts-from-json-schema/issues/33'
        );
      }
      if (schema.items === true) {
        // anything goes
        return [];
      }
      if (schema.items === false) {
        // no item is valid, empty tuple
        return [gen.tupleCombinator([])];
      }
      if (schema.items instanceof Array) {
        // tuple
        if ('additionalItems' in schema && schema.additionalItems === false) {
          const combinators = schema.items.map((s) => fromSchema(s));
          return [gen.tupleCombinator(combinators)];
        }

        throw new Error('tuples with ...rest are not supported, set additionalItems false');
      }
      // array
      return [gen.arrayCombinator(fromSchema(schema.items))];
    }
    return [];
  }

  function fromContains(schema: JSONSchema7): [gen.TypeReference] | [] {
    if ('contains' in schema && typeof schema.contains !== 'undefined') {
      warning('contains field not supported');
    }
    return [];
  }

  function fromArrayKeywords(schema: JSONSchema7): gen.TypeReference[] {
    return [...fromItems(schema), ...fromContains(schema)];
  }

  function fromEnum(schema: JSONSchema7): [gen.TypeReference] | [] {
    if ('enum' in schema && typeof schema.enum !== 'undefined') {
      const combinators = schema.enum.map((s) => {
        if (s === null) {
          if (args.maskNull) {
            helpers.add(nullHelper);
            return Null;
          }
          return gen.nullType;
        }
        switch (typeof s) {
          case 'string':
          case 'boolean':
          case 'number':
            return gen.literalCombinator(s);
        }

        throw new Error(`${typeof s}s are not supported as part of ENUM`);
      });
      return genUnionCombinator(combinators);
    }
    return [];
  }

  function fromConst(schema: JSONSchema7): [gen.TypeReference] | [] {
    if ('const' in schema && typeof schema.const !== 'undefined') {
      switch (typeof schema.const) {
        case 'string':
        case 'boolean':
        case 'number':
          return [gen.literalCombinator(schema.const)];
      }

      throw new Error(`${typeof schema.const}s are not supported as part of CONST`);
    }
    return [];
  }

  function fromAllOf(schema: JSONSchema7): [gen.TypeReference] | [] {
    if ('allOf' in schema && typeof schema.allOf !== 'undefined') {
      const combinators = schema.allOf.map((s) => fromSchema(s));
      if (combinators.length === 1) {
        const [combinator] = combinators;

        if (typeof combinator === 'undefined') {
          throw new Error('assert false');
        }

        return [combinator];
      }
      return [gen.intersectionCombinator(combinators)];
    }
    return [];
  }

  function fromAnyOf(schema: JSONSchema7): [gen.TypeReference] | [] {
    if ('anyOf' in schema && typeof schema.anyOf !== 'undefined') {
      const combinators = schema.anyOf.map((s) => fromSchema(s));
      return genUnionCombinator(combinators);
    }
    return [];
  }

  function fromOneOf(schema: JSONSchema7): [gen.TypeReference] | [] {
    if ('oneOf' in schema && typeof schema.oneOf !== 'undefined') {
      const combinators = schema.oneOf.map((s) => fromSchema(s));
      return genUnionCombinator(combinators);
    }
    return [];
  }

  function fromSchema(schema: JSONSchema7Definition, isRoot: boolean = false): gen.TypeReference {
    if (typeof schema === 'boolean') {
      imps.add("import * as t from 'io-ts';");
      if (schema) {
        // accept anything
        return gen.unknownType;
      } else {
        // accept nothing
        return genNeverType;
      }
    }
    // if (!isRoot && typeof schema.type === 'string' && ['string', 'number', 'integer'].includes(schema.type)) {
    //   info(`primitive type "${schema.type}" used outside top-level definitions`);
    // }

    for (const key in schema) {
      if (!isSupported(key, isRoot)) {
        notImplemented(key, 'field');
      }
    }
    if (isRefObject(schema)) {
      return fromRef(schema);
    }
    imps.add("import * as t from 'io-ts';");
    const combinators = [
      ...fromType(schema),
      ...fromObjectKeywords(schema),
      ...fromArrayKeywords(schema),
      ...fromEnum(schema),
      ...fromConst(schema),
      ...fromAllOf(schema),
      ...fromAnyOf(schema),
      ...fromOneOf(schema),
    ];
    if (combinators.length > 1) {
      return gen.intersectionCombinator(combinators);
    }
    if (combinators.length === 1) {
      const [combinator] = combinators;
      if (typeof combinator === 'undefined') {
        throw new Error('assert false');
      }
      return combinator;
    }
    if (generateChecks('x', schema).length > 1) {
      // skip checks
      return gen.unknownType;
    }

    throw new Error(`unknown schema: ${JSON.stringify(schema)}`);
  }

  function extractExamples(schema: JSONSchema7Definition): TSchemasCodegenExamples {
    if (typeof schema === 'boolean') {
      // note that in this context true is any and false is never
      return [];
    }
    if ('$ref' in schema) {
      warning('skipping examples handling for $ref object');
      return [];
    }
    const { examples } = schema;
    if (examples instanceof Array) {
      return examples;
    }
    if (typeof examples === 'undefined') {
      return [];
    }

    throw new Error('Unexpected format of examples');
  }

  function extractDefaultValue(schema: JSONSchema7Definition): JSONSchema7['default'] {
    if (typeof schema === 'boolean') {
      // note that in this context true is any and false is never
      return undefined;
    }
    if ('$ref' in schema) {
      warning('skipping default value handling for $ref object');
      return undefined;
    }
    return schema.default;
  }

  function fromDefinitions(definitions2: JSONSchema7['definitions']): ISchemasCodegenDefInput[] {
    const definitions = definitions2 ?? {};
    return Object.entries(definitions).flatMap(
      ([k, v]: [string, JSONSchema7Definition]): ISchemasCodegenDefInput[] => {
        const scem = v;
        const name = capitalize(k);

        if (typeof scem === 'boolean') {
          return [
            {
              meta: {
                title: undefined,
                description: undefined,
                examples: [],
                defaultValue: undefined,
              },
              dec: gen.typeDeclaration(
                name,
                gen.brandCombinator(scem ? gen.unknownType : genNeverType, () => String(scem), name),
                true
              ),
            },
          ];
        }
        if (isRefObject(scem)) {
          // ref's do not have meta data
          return [
            {
              meta: {
                title: undefined,
                description: undefined,
                examples: [],
                defaultValue: undefined,
              },
              dec: gen.typeDeclaration(
                name,
                gen.brandCombinator(fromRef(scem), () => String(true), name),
                true
              ),
            },
          ];
        }
        return [
          {
            meta: {
              title: scem.title,
              description: scem.description,
              examples: extractExamples(scem),
              defaultValue: extractDefaultValue(scem),
            },
            dec: gen.typeDeclaration(
              name,
              gen.brandCombinator(fromSchema(scem, true), (jx) => generateChecks(jx, scem), name),
              true
            ),
          },
        ];
      }
    );
  }

  function fromRoot(root: JSONSchema7): ISchemasCodegenDefInput[] {
    if (!root.hasOwnProperty('$schema')) {
      warning(`missing $schema declaration`);
    }

    // root schema info is printed in the beginning of the file
    const title = defaultExport;
    const description = 'The default export. More information at the top.';
    const examples = extractExamples(root);
    const defaultValue = extractDefaultValue(root);

    imps.add("import * as t from 'io-ts';");
    exps.add(`export default ${defaultExport};`);

    return [
      {
        meta: {
          title,
          description,
          examples,
          defaultValue,
        },
        dec: gen.typeDeclaration(
          defaultExport,
          gen.brandCombinator(
            isRefObject(root) ? error('schema root can not be a $ref object') : fromSchema(root, true),
            (jx) => generateChecks(jx, root),
            defaultExport
          ),
          true
        ),
      },
    ];
  }

  function fromFile(schema: JSONSchema7): ISchemasCodegenDefInput[] {
    const namedDefs = fromDefinitions(schema.definitions);
    if (namedDefs.map(({ dec: { name } }) => name).includes(defaultExport)) {
      warning('naming clash, ignoring default export');
      return namedDefs;
    }
    const rootDef = fromRoot(schema);
    const hyperDef = fromHyper({
      defaultExport,
      extractExamples,
      extractDefaultValue,
      imps,
      exps,
      fromSchema,
      generateChecks,
      warning,
    })(schema);
    return namedDefs.concat(rootDef).concat(hyperDef);
  }

  function constructDefs(defInputs: ISchemasCodegenDefInput[]): ISchemasCodegenDef[] {
    const metas: Record<string, ISchemasCodegenDefMeta> = {};
    defInputs.forEach((defInput: ISchemasCodegenDefInput) => {
      metas[defInput.dec.name] = defInput.meta;
    });
    const decs = defInputs.map(({ dec }) => dec);
    return gen.sort(decs).map((dec) => {
      const typeName = dec.name;
      const meta = metas[typeName];
      if (typeof meta === 'undefined') {
        throw new Error('assert false');
      }
      const title = meta.title ?? typeName;
      const description = meta.description ?? 'The purpose of this remains a mystery';
      const examples = meta.examples || [];
      const defaultValue = meta.defaultValue;
      const staticType = gen.printStatic(dec);
      const runtimeType = printC(dec)
        .concat('\n')
        .concat(gen.printRuntime(dec))
        .replace(`const ${typeName} `, `const ${typeName}: ${typeName}C `)
        .replace(/\ninterface /, '\nexport interface ');
      if (typeof meta.description !== 'string') {
        info('missing description');
      }
      return {
        typeName,
        title,
        description,
        examples,
        defaultValue,
        staticType,
        runtimeType,
      };
    });
  }

  const inputs: ISchemasCodegenDefInput[] = fromFile(inputSchema);
  const defs: ISchemasCodegenDef[] = constructDefs(inputs);

  if (returnCode === ErrorCode.ERROR) {
    throw new Error('Bailing because of errors');
  }
  if (returnCode === ErrorCode.WARNING && args.strict) {
    throw new Error('Bailing because of warnings');
  }
  yield '/*';
  yield '';
  yield `${inputSchema.title ?? 'No title'}`;
  yield `${inputSchema.description ?? 'No description'}`;
  yield '';
  yield '!!! AUTO GENERATED REFRAIN FROM MANUAL EDITING !!!';
  yield '';
  yield '*/';
  yield '';
  yield "import { JSONSchema7 } from 'json-schema';";
  yield* imps;
  yield '';
  yield* helpers;
  yield '';
  yield `export const schema: JSONSchema7 = ${JSON.stringify(inputSchema, undefined, 2)};`;
  yield '';

  for (const def of defs) {
    const { typeName, title, description, examples, defaultValue, staticType, runtimeType } = def;
    yield `// ${title}`;
    yield `// ${description}`;
    yield staticType;
    yield runtimeType;
    if (examples.length > 0) {
      yield `// FOR_TEST:${typeName}:${JSON.stringify(examples)}`;
    }
    if (typeof defaultValue !== 'undefined') {
      yield `// FOR_TEST:${typeName}:${JSON.stringify([defaultValue])}`;
    }
    yield '';
  }

  yield* exps;
}
