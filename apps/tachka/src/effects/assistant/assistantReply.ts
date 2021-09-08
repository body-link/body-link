import { act, matchEvent, useContext } from '@marblejs/core';
import { MsgEffect } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';
import { pipe } from 'fp-ts/function';
import * as r from 'rxjs';
import { AssistantToken } from '../../dependencies/assistant/Assistant';
import { ReplyCommand } from './types';

export const assistantReply$: MsgEffect = (event$, ctx) => {
  const assistant = useContext(AssistantToken)(ctx.ask);
  return pipe(
    event$,
    matchEvent(ReplyCommand),
    act(eventValidator$(ReplyCommand)),
    act((event) => {
      assistant.reply(event.payload.reply);
      return r.EMPTY;
    })
  );
};
