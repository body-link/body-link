/* eslint-disable @typescript-eslint/naming-convention,@rushstack/typedef-var */
import { AsOpaque, AType, EType, summon } from './utils';

const ReplyEntry_ = summon((F) =>
  F.interface(
    {
      subject: F.string(),
      action: F.string(),
    },
    'ReplyEntry'
  )
);
export interface ReplyEntry extends AType<typeof ReplyEntry_> {}
export interface ReplyEntryRaw extends EType<typeof ReplyEntry_> {}
export const ReplyEntry = AsOpaque<ReplyEntryRaw, ReplyEntry>()(ReplyEntry_);
