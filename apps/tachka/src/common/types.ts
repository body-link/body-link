import type { HttpHeaders, HttpStatus } from '@marblejs/core';
import { EventCodec, EventSchema, EventWithoutPayload, EventWithPayload } from '@marblejs/core';
import * as TE from 'fp-ts/TaskEither';
import { ErrorApp, ErrorIO } from '../data/error/ErrorApp';
import { ErrorGeneral } from '../data/error/ErrorGeneral';

// NOTE: HttpEffectResponse without request property and rest properties are required
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface HttpResponse<T> {
  status: HttpStatus;
  headers: HttpHeaders;
  body: T;
}

export type HttpHeaderName = keyof HttpHeaders;

export type HttpHeaderValue = HttpHeaders[HttpHeaderName];

export type EventAType<T extends EventCodec> = T extends EventSchema<never>
  ? EventWithoutPayload<T['_A']['type']>
  : EventWithPayload<T['_A']['payload'], T['_A']['type']>;

export type TEErrorGeneral<T> = TE.TaskEither<ErrorGeneral, T>;

export type TEErrorApp<T> = TE.TaskEither<ErrorApp, T>;

export type TEErrorIO<T> = TE.TaskEither<ErrorIO, T>;
