import memoizeOne from 'memoize-one';
import { TOption } from '@body-link/type-guards';
import { createContextToken, createReader } from '@marblejs/core';
import { getState } from '../../state';

// eslint-disable-next-line @rushstack/typedef-var
const Keyv = require('@keyvhq/core');
// eslint-disable-next-line @rushstack/typedef-var
const KeyvMongo = require('@keyvhq/mongo');

// eslint-disable-next-line @rushstack/typedef-var
const store = new KeyvMongo(getState().mongoURI);

const createKVStorage: (namespace: string) => IKVStorage = memoizeOne(
  (namespace: string) => new Keyv({ store, namespace })
);

// eslint-disable-next-line @rushstack/typedef-var
export const KVStorageToken = createContextToken<typeof createKVStorage>('KVStorage');

// eslint-disable-next-line @rushstack/typedef-var
export const KVStorage = createReader(() => createKVStorage);

export interface IKVStorage {
  get<T>(key: string): Promise<TOption<T>>;

  set<T>(key: string, value: T, ttl?: number): Promise<true>;

  has(key: string): Promise<boolean>;

  // Returns a promise which resolves to true if the key existed, false if not
  delete(key: string): Promise<boolean>;

  clear(): Promise<void>;
}
