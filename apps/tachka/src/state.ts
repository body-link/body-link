import memoizeOne from 'memoize-one';
import { t } from '@marblejs/middleware-io';
import { NonEmptyString, NumberFromString } from 'io-ts-types';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';

// eslint-disable-next-line @rushstack/typedef-var
const env = {
  node: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoURI: process.env.MONGO_URI,
  telegram: {
    token: process.env.TG_TOKEN,
    adminID: process.env.TG_ADMIN_ID,
  },
};

// eslint-disable-next-line @rushstack/typedef-var
const defaultState = {
  port: 3495,
};

export const getState: () => IState = memoizeOne(() => {
  const state: IState = {
    isDev: env.node !== 'production',
    mongoURI: pipe(
      O.fromNullable(env.mongoURI),
      O.getOrElseW(() => {
        throw new Error('Please set mongoURI environment variable');
      })
    ),
    port: pipe(
      NumberFromString.decode(env.telegram),
      O.fromEither,
      O.getOrElse(() => defaultState.port)
    ),
    telegram: pipe(
      t
        .type({
          token: NonEmptyString,
          adminID: NumberFromString,
        })
        .decode(env.telegram),
      O.fromEither,
      O.toUndefined
    ),
  };
  return state;
});

export interface IState {
  isDev: boolean;
  mongoURI: string;
  port: number;
  telegram?: {
    token: string;
    adminID: number;
  };
}
