import { Event, ValidatedEvent } from '@marblejs/core';
import { EventCodec } from '@marblejs/core/dist/event/event';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as r from 'rxjs';
import { eitherMapLeftToErrorDecode, throwErrorApp } from '../common/utils';

export const validateEvent =
  <C extends EventCodec>(
    codec: C
  ): (<E extends Event>(event: E) => r.Observable<ValidatedEvent<C['_A']['payload'], C['_A']['type']>>) =>
  (event) =>
    new r.Observable((subscriber) => {
      subscriber.next(pipe(event, codec.decode, eitherMapLeftToErrorDecode, E.getOrElseW(throwErrorApp)));
    });
