/* eslint-disable @typescript-eslint/naming-convention,@rushstack/typedef-var */
import { isDefined } from '@body-link/type-guards';
import { markdownv2 as f } from 'telegram-format';
import { dedent } from 'ts-dedent';
import { LogEntry } from './LogEntry';
import { ReplyEntry } from './ReplyEntry';
import { AOfMorphADT, AsOpaque, AType, EType, summon, Variant } from './utils';

const ReplyResult_ = summon((F) =>
  F.interface(
    { type: F.stringLiteral('ReplyResult'), entry: ReplyEntry(F), result: F.string() },
    'ReplyResult',
    {
      ShowURI: () => ({ show: (r) => `${r.type}: ${r.result}` }),
    }
  )
);
export interface ReplyResult extends AType<typeof ReplyResult_> {}
export interface ReplyResultRaw extends EType<typeof ReplyResult_> {}
export const ReplyResult = AsOpaque<ReplyResultRaw, ReplyResult>()(ReplyResult_);

const ReplyError_ = summon((F) =>
  F.interface(
    { type: F.stringLiteral('ReplyError'), entry: ReplyEntry(F), error: F.string() },
    'ReplyError',
    {
      ShowURI: () => ({ show: (r) => `${r.type}: ${r.error}` }),
    }
  )
);
export interface ReplyError extends AType<typeof ReplyError_> {}
export interface ReplyErrorRaw extends EType<typeof ReplyError_> {}
export const ReplyError = AsOpaque<ReplyErrorRaw, ReplyError>()(ReplyError_);

const ReplyRequest_ = summon((F) =>
  F.interface(
    {
      type: F.stringLiteral('ReplyRequest'),
      entry: ReplyEntry(F),
      instruction: F.string(),
      URL: F.optional(F.string()),
    },
    'ReplyRequest',
    { ShowURI: () => ({ show: (r) => `${r.type}: ${r.instruction}` }) }
  )
);
export interface ReplyRequest extends AType<typeof ReplyRequest_> {}
export interface ReplyRequestRaw extends EType<typeof ReplyRequest_> {}
export const ReplyRequest = AsOpaque<ReplyRequestRaw, ReplyRequest>()(ReplyRequest_);

export const Reply = Variant({
  ReplyResult,
  ReplyError,
  ReplyRequest,
});
export type Reply = AOfMorphADT<typeof Reply>;

export const convertReplyToLogEntry = Reply.matchStrict({
  ReplyResult: (r) => LogEntry.build({ level: 'info', message: ReplyResult.show.show(r) }),
  ReplyError: (r) => LogEntry.build({ level: 'error', message: ReplyError.show.show(r) }),
  ReplyRequest: (r) => LogEntry.build({ level: 'warn', message: ReplyRequest.show.show(r) }),
});

export const getReplyMarkdownV2 = Reply.matchStrict({
  ReplyResult: (r) => f.escape(r.result),
  ReplyError: (r) => `${f.bold(f.escape(`Error happened:`))} ${f.escape(r.error)}`,
  ReplyRequest: (r) => {
    const md2: string[] = [
      dedent`
        ${f.bold(f.escape(`Need your action:`))}
        ${f.monospaceBlock(r.instruction)}
      `,
    ];
    if (isDefined(r.URL)) {
      md2.push(f.url(f.escape(r.URL), r.URL));
    }
    return md2.join('\n');
  },
});
