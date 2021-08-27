/* eslint-disable @typescript-eslint/naming-convention,@rushstack/typedef-var */
import { ObjectId } from 'mongodb';
import { AOfMorphADT, Variant } from '../utils';
import { RecordText } from './RecordText';
import { RecordNumber } from './RecordNumber';
import { RecordUnknown } from './RecordUnknown';
import { removeUndefined } from '@body-link/helpers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const recordMeta = {
  RecordText: 'r_text',
  RecordNumber: 'r_number',
  RecordUnknown: 'r_unknown',
} as const;

export const RecordAny = Variant({
  RecordText,
  RecordNumber,
  RecordUnknown,
});
export type RecordAny = AOfMorphADT<typeof RecordAny>;

export const getRecordCollectionName = RecordAny.matchStrict({
  RecordText: () => recordMeta.RecordText,
  RecordNumber: () => recordMeta.RecordNumber,
  RecordUnknown: () => recordMeta.RecordUnknown,
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const toMongo = (record: RecordAny) => {
  const { id, timestamp, ...rest } = RecordAny.type.encode(record);
  return removeUndefined({
    _id: id as unknown as ObjectId,
    timestamp: new Date(timestamp),
    ...rest,
  });
};
