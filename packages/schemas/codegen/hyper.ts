import * as gen from 'io-ts-codegen';
import { JSONSchema7 } from 'json-schema';
import { parse as validate } from 'uri-template';
import { ISchemasCodegenDefInput, ISchemasCodegenGenRefs } from './types';

type Template = string;
type Variable = string;

type Field = string;
type Constant = string;

interface ILinkContainer {
  rel: 'implementation';

  href: Template;
  hrefSchema: Record<Variable, JSONSchema7>;

  headerSchema: Record<Field, JSONSchema7>;
  submissionSchema: JSONSchema7;

  targetHints: Record<Field, Constant[]>;
  targetSchema: JSONSchema7;
}

interface IHyper {
  links: ILinkContainer[];
}

export function toHref(g: ISchemasCodegenGenRefs): (link: ILinkContainer) => ISchemasCodegenDefInput {
  return (link) => {
    validate(link.href);

    const hrefTemplateExport = `_links_${link.rel}_Href`;
    const schema: JSONSchema7 = {
      type: 'string',
      const: link.href,
      default: link.href,
    };

    const title = 'Href Template';
    const description = 'Href body format as described by hyper schema href.';
    const examples = g.extractExamples(schema);
    const defaultValue = g.extractDefaultValue(schema);

    return {
      meta: {
        title,
        description,
        examples,
        defaultValue,
      },
      dec: gen.typeDeclaration(
        hrefTemplateExport,
        gen.brandCombinator(g.fromSchema(schema), (jx) => g.generateChecks(jx, schema), hrefTemplateExport),
        true
      ),
    };
  };
}

export function toHrefSchema(g: ISchemasCodegenGenRefs): (link: ILinkContainer) => ISchemasCodegenDefInput {
  return (link) => {
    const hrefVariablesExport = `_links_${link.rel}_HrefSchema`;
    const schema: JSONSchema7 = link.hrefSchema;

    const title = 'Href Variables';
    const description = 'Href variable format as described by hyper schema hrefSchema.';
    const examples = g.extractExamples(schema);
    const defaultValue = g.extractDefaultValue(schema);

    return {
      meta: {
        title,
        description,
        examples,
        defaultValue,
      },
      dec: gen.typeDeclaration(
        hrefVariablesExport,
        gen.brandCombinator(g.fromSchema(schema), (jx) => g.generateChecks(jx, schema), hrefVariablesExport),
        true
      ),
    };
  };
}

export function toSubmissionSchema(
  g: ISchemasCodegenGenRefs
): (link: ILinkContainer) => ISchemasCodegenDefInput {
  return (link) => {
    const requestBodyExport = `_links_${link.rel}_SubmissionSchema`;
    const schema: JSONSchema7 = link.submissionSchema;

    const title = 'Request Body';
    const description = 'Request body format as described by hyper schema submissionSchema.';
    const examples = g.extractExamples(schema);
    const defaultValue = g.extractDefaultValue(schema);

    return {
      meta: {
        title,
        description,
        examples,
        defaultValue,
      },
      dec: gen.typeDeclaration(
        requestBodyExport,
        gen.brandCombinator(g.fromSchema(schema), (jx) => g.generateChecks(jx, schema), requestBodyExport),
        true
      ),
    };
  };
}

export function toHeaderSchema(g: ISchemasCodegenGenRefs): (link: ILinkContainer) => ISchemasCodegenDefInput {
  return (link) => {
    const requestHeadersExport = `_links_${link.rel}_HeaderSchema`;
    const schema: JSONSchema7 = {
      allOf: [
        {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
        },
        {
          type: 'object',
          properties: link.headerSchema,
          required: Object.keys(link.headerSchema),
          additionalProperties: true,
        },
      ],
    };

    const title = 'Request Headers';
    const description = 'Request headers format as described by hyper schema headerSchema.';
    const examples = g.extractExamples(schema);
    const defaultValue = g.extractDefaultValue(schema);

    return {
      meta: {
        title,
        description,
        examples,
        defaultValue,
      },
      dec: gen.typeDeclaration(
        requestHeadersExport,
        gen.brandCombinator(g.fromSchema(schema), (jx) => g.generateChecks(jx, schema), requestHeadersExport),
        true
      ),
    };
  };
}

export function toTargetSchema(g: ISchemasCodegenGenRefs): (link: ILinkContainer) => ISchemasCodegenDefInput {
  return (link) => {
    const responseBodyExport = `_links_${link.rel}_TargetSchema`;
    const schema: JSONSchema7 = link.targetSchema;

    const title = 'Response Body';
    const description = 'Response body format as described by hyper schema targetschema.';
    const examples = g.extractExamples(schema);
    const defaultValue = g.extractDefaultValue(schema);

    return {
      meta: {
        title,
        description,
        examples,
        defaultValue,
      },
      dec: gen.typeDeclaration(
        responseBodyExport,
        gen.brandCombinator(g.fromSchema(schema), (jx) => g.generateChecks(jx, schema), responseBodyExport),
        true
      ),
    };
  };
}

export function toTargetHints(g: ISchemasCodegenGenRefs): (link: ILinkContainer) => ISchemasCodegenDefInput {
  return (link) => {
    const headers = Object.entries(link.targetHints).map(([k, v]): [string, string] => [k, v.join(', ')]);

    const responseHeadersExport = `_links_${link.rel}_TargetHints`;
    const schema: JSONSchema7 = {
      allOf: [
        {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
        },
        {
          type: 'object',
          properties: Object.fromEntries(headers.map(([k, v]) => [k, { type: 'string', const: v }])),
          required: headers.map(([k]) => k),
          additionalProperties: true,
        },
      ],
      default: Object.fromEntries(headers),
    };

    const title = 'Response Headers';
    const description = 'Response headers format as described by hyper schema targetHints.';
    const examples = g.extractExamples(schema);
    const defaultValue = g.extractDefaultValue(schema);

    return {
      meta: {
        title,
        description,
        examples,
        defaultValue,
      },
      dec: gen.typeDeclaration(
        responseHeadersExport,
        gen.brandCombinator(
          g.fromSchema(schema),
          (jx) => g.generateChecks(jx, schema),
          responseHeadersExport
        ),
        true
      ),
    };
  };
}

export function fromSelfLink(g: ISchemasCodegenGenRefs): (link: ILinkContainer) => ISchemasCodegenDefInput[] {
  g.imps.add("import * as t from 'io-ts';");

  return (link) => [
    toHref(g)(link),
    toHrefSchema(g)(link),
    toHeaderSchema(g)(link),
    toSubmissionSchema(g)(link),
    toTargetHints(g)(link),
    toTargetSchema(g)(link),
  ];
}

export function fromHyper(g: ISchemasCodegenGenRefs): (root: JSONSchema7) => ISchemasCodegenDefInput[] {
  return (root) => {
    const hyper: IHyper = root as IHyper;
    const links: ILinkContainer[] = hyper.links ?? [];
    const implementations: ILinkContainer[] = links.filter(({ rel }) => rel === 'implementation');
    if (implementations.length > 1) {
      g.warning('found several links where rel="implementation"');
      return [];
    }
    if (implementations.length !== links.length) {
      g.warning('only hyper schema links with rel="implementation" are supported at the moment');
    }
    const [first] = implementations;
    if (typeof first === 'undefined') {
      return [];
    }

    return fromSelfLink(g)(first);
  };
}
