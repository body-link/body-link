/* eslint-disable @typescript-eslint/naming-convention,@rushstack/typedef-var */
import { Newtype } from 'newtype-ts';
import { AsOpaque, AType, EType, M, summon } from '../utils';
import { createRecordFromData } from './utils';

export type RecordUnknownDataRaw = unknown;
export interface RecordUnknownData
  extends Newtype<{ readonly RecordUnknownData: unique symbol }, RecordUnknownDataRaw> {}
const RecordUnknownData_: M<RecordUnknownDataRaw, RecordUnknownData> = summon((F) =>
  F.newtype<RecordUnknownData>('RecordUnknownData')(F.unknown())
);
export const RecordUnknownData = AsOpaque<RecordUnknownDataRaw, RecordUnknownData>()(RecordUnknownData_);

export const RecordUnknown_ = createRecordFromData(RecordUnknownData, 'RecordUnknown');
export interface RecordUnknown extends AType<typeof RecordUnknown_> {}
export interface RecordUnknownRaw extends EType<typeof RecordUnknown_> {}
export const RecordUnknown = AsOpaque<RecordUnknownRaw, RecordUnknown>()(RecordUnknown_);
