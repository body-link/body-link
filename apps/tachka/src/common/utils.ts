import { isError } from '@body-link/type-guards';
import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { appErrorToMessage, ErrorApp, ErrorIO } from '../data/error/ErrorApp';
import { ErrorDecode } from '../data/error/ErrorDecode';
import { ErrorGeneral } from '../data/error/ErrorGeneral';
import { TEErrorGeneral } from './types';

export const mapToError = (message: string): Error => new Error(message);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throwException = (error: any): never => {
  throw error;
};

export const throwErrorApp: (error: ErrorApp) => never = flow(appErrorToMessage, mapToError, throwException);

export const eitherMapLeftToErrorDecode: <A>(fa: t.Validation<A>) => E.Either<ErrorDecode, A> = E.mapLeft(
  (errors) => ErrorIO.as.ErrorDecode({ errors: formatValidationErrors(errors, { truncateLongTypes: false }) })
);

export const decodeWith = <A extends t.Mixed>(codec: A): R.Reader<A['_I'], E.Either<ErrorDecode, A>> =>
  flow(codec.decode, eitherMapLeftToErrorDecode);

export const fromPromiseFabric = <T>(fabric: () => Promise<T>): TEErrorGeneral<T> =>
  TE.tryCatch(
    fabric,
    (error: unknown): ErrorGeneral =>
      pipe(
        error,
        O.fromPredicate(isError),
        O.getOrElse(() => new Error(String(error))),
        (e) => ErrorIO.as.ErrorGeneral({ message: e.message, name: e.name })
      )
  );
