import { isDefined, isError, isObject, isText, TAnyObject } from '@body-link/type-guards';
import { Event } from '@marblejs/core';
import { pipe } from 'fp-ts/function';
import * as r from 'rxjs';
import * as ro from 'rxjs/operators';
import { Reply, ReplyError } from '../data/Reply';
import { ReplyEntry } from '../data/ReplyEntry';
import { ReplyCommand } from '../effects/assistant/types';

export function assist<InputEvent extends Event, CallEvent extends Event>(
  entry: ReplyEntry,
  callFn: (event: InputEvent, entry: ReplyEntry) => r.Observable<CallEvent>
): (source: r.Observable<InputEvent>) => r.Observable<CallEvent>;

export function assist<InputEvent extends Event>(
  entry: ReplyEntry,
  callFn: (event: InputEvent, entry: ReplyEntry) => r.Observable<Reply>
): (source: r.Observable<InputEvent>) => r.Observable<ReplyCommand>;

export function assist<InputEvent extends Event, CallEvent extends Event>(
  entry: ReplyEntry,
  callFn: (event: InputEvent, entry: ReplyEntry) => r.Observable<CallEvent | Reply>
): (source: r.Observable<InputEvent>) => r.Observable<CallEvent | ReplyCommand> {
  const handleError = (error: unknown): r.Observable<ReplyError> => {
    const message = isError(error)
      ? error.message
      : isObject(error) && isText((error as TAnyObject).message)
      ? (error as { message: string }).message
      : String(error);
    return r.of(
      Reply.as.ReplyError({
        entry,
        error: message,
      })
    );
  };
  return (source: r.Observable<InputEvent>): r.Observable<CallEvent | ReplyCommand> =>
    pipe(
      source,
      ro.mergeMap((event) => {
        if (isDefined(event.error)) {
          return r.of(event as Event as CallEvent);
        }

        if (ReplyCommand.is(event)) {
          return r.of(event);
        }

        return pipe(
          r.defer(() => {
            try {
              return pipe(callFn(event, entry), ro.catchError(handleError));
            } catch (error) {
              return handleError(error);
            }
          }),
          ro.mergeMap((result) => {
            const eventsOut: Event[] = [];
            if (Reply.type.is(result)) {
              eventsOut.push(
                ReplyCommand.create({
                  reply: result,
                })
              );
              if (Reply.is.ReplyError(result)) {
                eventsOut.push({
                  ...event,
                  error: new Error(result.error),
                });
              }
            } else {
              eventsOut.push(result);
            }
            return eventsOut as (CallEvent | ReplyCommand)[];
          })
        );
      })
    );
}
