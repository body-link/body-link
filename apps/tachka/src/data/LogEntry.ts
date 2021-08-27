/* eslint-disable @typescript-eslint/naming-convention,@rushstack/typedef-var */
import { AsOpaque, AType, EType, summon } from './utils';

const LogEntry_ = summon((F) =>
  F.interface(
    {
      level: F.keysOf({
        error: null,
        warn: null,
        info: null,
      }),
      message: F.string(),
    },
    'LogEntry'
  )
);
export interface LogEntry extends AType<typeof LogEntry_> {}
export interface LogEntryRaw extends EType<typeof LogEntry_> {}
export const LogEntry = AsOpaque<LogEntryRaw, LogEntry>()(LogEntry_);
