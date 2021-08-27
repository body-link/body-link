/* eslint-disable @typescript-eslint/naming-convention,@rushstack/typedef-var */
import { Newtype } from 'newtype-ts';
import { AsOpaque, AType, EType, M, summon } from '../utils';
import { createRecordFromData } from './utils';

export type RecordNumberDataRaw = number;
export interface RecordNumberData
  extends Newtype<{ readonly RecordNumberData: unique symbol }, RecordNumberDataRaw> {}
const RecordNumberData_: M<RecordNumberDataRaw, RecordNumberData> = summon((F) =>
  F.newtype<RecordNumberData>('RecordNumberData')(F.number())
);
export const RecordNumberData = AsOpaque<RecordNumberDataRaw, RecordNumberData>()(RecordNumberData_);

export const RecordNumber_ = createRecordFromData(RecordNumberData, 'RecordNumber');
export interface RecordNumber extends AType<typeof RecordNumber_> {}
export interface RecordNumberRaw extends EType<typeof RecordNumber_> {}
export const RecordNumber = AsOpaque<RecordNumberRaw, RecordNumber>()(RecordNumber_);
