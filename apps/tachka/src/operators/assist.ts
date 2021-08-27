import { Event } from '@marblejs/core';
import { isDefined, isError, isObject, isText, TAnyObject } from '@body-link/type-guards';
import { ReplyEntry } from '../data/ReplyEntry';
import { defer, Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { pipe } from 'fp-ts/function';
import { ReplyCommand } from '../effects/assistant/types';
import { createReplyError, Reply, ReplyError } from '../data/Reply';

export function assist<InputEvent extends Event, CallEvent extends Event>(
  entry: ReplyEntry,
  callFn: (event: InputEvent, entry: ReplyEntry) => Observable<CallEvent>
): (source: Observable<InputEvent>) => Observable<CallEvent>;

export function assist<InputEvent extends Event>(
  entry: ReplyEntry,
  callFn: (event: InputEvent, entry: ReplyEntry) => Observable<Reply>
): (source: Observable<InputEvent>) => Observable<ReplyCommand>;

export function assist<InputEvent extends Event, CallEvent extends Event>(
  entry: ReplyEntry,
  callFn: (event: InputEvent, entry: ReplyEntry) => Observable<CallEvent | Reply>
): (source: Observable<InputEvent>) => Observable<CallEvent | ReplyCommand> {
  const handleError = (error: unknown): Observable<ReplyError> => {
    const message = isError(error)
      ? error.message
      : isObject(error) && isText((error as TAnyObject).message)
      ? (error as { message: string }).message
      : String(error);
    return of(
      createReplyError({
        entry,
        error: message,
      })
    );
  };
  return (source: Observable<InputEvent>): Observable<CallEvent | ReplyCommand> =>
    source.pipe(
      mergeMap((event) => {
        if (isDefined(event.error)) {
          return of(event as Event as CallEvent);
        }

        if (ReplyCommand.is(event)) {
          return of(event);
        }

        return pipe(
          defer(() => {
            try {
              return pipe(callFn(event, entry), catchError(handleError));
            } catch (error) {
              return handleError(error);
            }
          }),
          mergeMap((result) => {
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
