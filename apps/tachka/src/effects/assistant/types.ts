import * as t from 'io-ts';
import { event } from '@marblejs/core';
import { Reply } from '../../data/Reply';
import { EventAType } from '../../common/types';

export enum AssistantCommandType {
  REPLY = 'REPLY',
}

// eslint-disable-next-line @rushstack/typedef-var
export const ReplyCommand = event(AssistantCommandType.REPLY)(
  t.type({
    reply: Reply.type,
  })
);
export type ReplyCommand = EventAType<typeof ReplyCommand>;
