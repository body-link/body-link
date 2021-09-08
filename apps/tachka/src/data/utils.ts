import { ProgramUnionURI } from '@morphic-ts/batteries/lib/program';
import * as Summoner from '@morphic-ts/batteries/lib/summoner-ESBST';
import { IoTsURI } from '@morphic-ts/io-ts-interpreters';
import { ProgramType } from '@morphic-ts/summoners';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as WM from 'io-ts-types/lib/withMessage';

export { AOfMorphADT, AType, EType } from '@morphic-ts/summoners';

const { AsOpaque, AsUOpaque, summonFor } = Summoner;

export interface IAppEnv {
  [IoTsURI]: {
    WM: typeof WM;
  };
}

const { summon, tagged } = summonFor<IAppEnv>({
  [IoTsURI]: {
    WM,
  },
});
export type M<E, A> = Summoner.M<IAppEnv, E, A>;
export type UM<A> = Summoner.UM<IAppEnv, A>;

export { summon, AsOpaque, AsUOpaque, tagged };

// eslint-disable-next-line @rushstack/typedef-var
export const Variant = tagged('type');

export type Program<E, A> = ProgramType<IAppEnv, E, A>[ProgramUnionURI];

export const refine = <C extends t.Any, T = t.TypeOf<C>>(
  codec: C,
  check: (x: T) => boolean,
  name: string
): C =>
  tt.withValidate(
    codec,
    (u, c) =>
      pipe(
        codec.validate(u, c),
        E.chain((value) => (check(value) ? t.success(value) : t.failure(value, c, `Expected ${name} type`)))
      ),
    name
  );

export const option = <T extends t.Any>(
  type: T,
  name = `${type.name} | undefined`
): t.UnionType<
  [T, t.UndefinedType],
  t.TypeOf<T> | undefined,
  t.OutputOf<T> | undefined,
  t.InputOf<T> | undefined
> => t.union<[T, t.UndefinedType]>([type, t.undefined], name);