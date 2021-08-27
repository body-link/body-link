import { EMPTY } from 'rxjs';
import { MsgEffect } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';
import { act, matchEvent, useContext } from '@marblejs/core';
import { AssistantToken } from '../../dependencies/assistant/Assistant';
import { ReplyCommand } from './types';

export const assistantReply$: MsgEffect = (event$, ctx) => {
  const assistant = useContext(AssistantToken)(ctx.ask);
  return event$.pipe(
    matchEvent(ReplyCommand),
    act(eventValidator$(ReplyCommand)),
    act((event) => {
      assistant.reply(event.payload.reply);
      return EMPTY;
    })
  );
};
