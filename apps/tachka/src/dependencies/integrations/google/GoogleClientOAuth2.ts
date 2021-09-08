import { createContextToken, createReader } from '@marblejs/core';
import * as t from 'io-ts';
import { tr } from '../../../data/io-ts-refine';
import { IKVStorage } from '../../kv-storage/KVStorage';
import { createKVStorageValue, IKVStorageValue, useKVIntegrations } from '../../kv-storage/utils';

export interface IGoogleClientOAuth2State {
  clientID: string;
  clientSecret: string;
}

const codec: t.Type<IGoogleClientOAuth2State, IGoogleClientOAuth2State> = t.strict(
  {
    clientID: tr.NonEmptyString,
    clientSecret: tr.NonEmptyString,
  },
  'GoogleClientOAuth2State'
);

// eslint-disable-next-line @rushstack/typedef-var
const KVStorageValue = createKVStorageValue({
  key: codec.name,
  codec,
  defaultValue: { clientID: 'a', clientSecret: 'v' },
});

export class GoogleClientOAuth2 {
  public readonly state: IKVStorageValue<typeof codec>;

  public constructor(kv: IKVStorage) {
    this.state = KVStorageValue(kv);
  }
}

// eslint-disable-next-line @rushstack/typedef-var
export const GoogleClientOAuth2Token = createContextToken<GoogleClientOAuth2>('GoogleClientOAuth2');

// eslint-disable-next-line @rushstack/typedef-var
export const googleClientOAuth2 = createReader((ask) => {
  const KVIntegrations = useKVIntegrations(ask);
  return new GoogleClientOAuth2(KVIntegrations);
});
