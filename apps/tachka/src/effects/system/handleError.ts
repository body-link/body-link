import { useContext } from '@marblejs/core';
import { MsgErrorEffect } from '@marblejs/messaging';
import { pipe } from 'fp-ts/function';
import * as ro from 'rxjs/operators';
import { Reply } from '../../data/Reply';
import { ReplyEntry } from '../../data/ReplyEntry';
import { AssistantToken } from '../../dependencies/assistant/Assistant';

export const handleError$: MsgErrorEffect = (input$, ctx) => {
  const assistant = useContext(AssistantToken)(ctx.ask);
  return pipe(
    input$,
    ro.tap((error) => {
      assistant.reply(
        Reply.as.ReplyError({
          entry: ReplyEntry.build({
            subject: 'System',
            action: 'UNHANDLED_ERROR',
          }),
          error: error.message,
        })
      );
    }),
    ro.map((error) => ({
      type: 'UNHANDLED_ERROR',
      error: { name: error.name, message: error.message },
    }))
  );
};
