import { MsgErrorEffect } from '@marblejs/messaging';
import { useContext } from '@marblejs/core';
import { AssistantToken } from '../../dependencies/assistant/Assistant';
import { map, tap } from 'rxjs/operators';
import { createReplyError } from '../../data/Reply';
import { ReplyEntry } from '../../data/ReplyEntry';

export const handleError$: MsgErrorEffect = (input$, ctx) => {
  const assistant = useContext(AssistantToken)(ctx.ask);
  return input$.pipe(
    tap((error) => {
      assistant.reply(
        createReplyError({
          entry: ReplyEntry.build({
            subject: 'System',
            action: 'UNHANDLED_ERROR',
          }),
          error: error.message,
        })
      );
    }),
    map((error) => ({
      type: 'UNHANDLED_ERROR',
      error: { name: error.name, message: error.message },
    }))
  );
};
