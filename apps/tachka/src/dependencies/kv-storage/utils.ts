import { ContextProvider, useContext } from '@marblejs/core';
import { constVoid, flow, pipe } from 'fp-ts/function';
import * as R from 'fp-ts/Reader';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { TEErrorGeneral, TEErrorIO } from '../../common/types';
import { decodeWith, fromPromiseFabric } from '../../common/utils';
import { IKVStorage, KVStorageToken } from './KVStorage';

enum EKVStorageReservedNamespaces {
  Integrations = '_integrations',
}

export const createUseKVStorage =
  (namespace: string): R.Reader<ContextProvider, IKVStorage> =>
  (ask) =>
    useContext(KVStorageToken)(ask)(namespace);

export const useKVIntegrations: R.Reader<ContextProvider, IKVStorage> = createUseKVStorage(
  EKVStorageReservedNamespaces.Integrations
);

export interface IKVStorageValue<T> {
  get: TEErrorIO<T>;
  set(value: unknown): TEErrorIO<T>;
  clear: TEErrorGeneral<void>;
}

export const createKVStorageValue =
  <C extends t.Mixed>({
    key,
    codec,
    defaultValue,
  }: {
    key: string;
    codec: C;
    defaultValue: t.TypeOf<C>;
  }): R.Reader<IKVStorage, IKVStorageValue<C>> =>
  (kv) => {
    return {
      get: pipe(
        fromPromiseFabric(() => kv.get(key)),
        TE.map((val) => val ?? defaultValue),
        TE.chainEitherKW(flow(decodeWith(codec)))
      ),
      set: flow(
        decodeWith(codec),
        TE.fromEither,
        TE.chainW((valueDecoded) =>
          pipe(
            fromPromiseFabric(() => kv.set(key, valueDecoded)),
            TE.map(() => valueDecoded)
          )
        )
      ),
      clear: pipe(
        fromPromiseFabric(() => kv.delete(key)),
        TE.map(constVoid)
      ),
    };
  };
