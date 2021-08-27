import { t } from '../common/modules';
import { Event, ValidatedEvent } from '@marblejs/core';
import { Observable } from 'rxjs';
import { pipe } from 'fp-ts/function';
import { getOrElseW } from 'fp-ts/Either';
import { throwErrors } from '../data/utils';

export const validateEvent =
  <Schema extends t.Any>(
    schema: Schema
  ): (<InputEvent extends Event>(
    event: InputEvent
  ) => Observable<ValidatedEvent<Schema['_A']['payload'], Schema['_A']['type']>>) =>
  (event) =>
    new Observable((subscriber) => {
      subscriber.next(pipe(schema.decode(event), getOrElseW(throwErrors)));
    });
