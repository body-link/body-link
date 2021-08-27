/* eslint-disable @typescript-eslint/naming-convention,@rushstack/typedef-var */
import { Newtype } from 'newtype-ts';
import { AsOpaque, AType, EType, M, summon } from '../utils';
import { createRecordFromData } from './utils';
import { tr } from '../io-ts-refine';

export type RecordTextDataRaw = string;
export interface RecordTextData
  extends Newtype<{ readonly RecordTextData: unique symbol }, RecordTextDataRaw> {}
const RecordTextData_: M<RecordTextDataRaw, RecordTextData> = summon((F) =>
  F.newtype<RecordTextData>('RecordTextData')(F.string({ IoTsURI: () => tr.NonEmptyString }))
);
export const RecordTextData = AsOpaque<RecordTextDataRaw, RecordTextData>()(RecordTextData_);

export const RecordText_ = createRecordFromData(RecordTextData, 'RecordText');
export interface RecordText extends AType<typeof RecordText_> {}
export interface RecordTextRaw extends EType<typeof RecordText_> {}
export const RecordText = AsOpaque<RecordTextRaw, RecordText>()(RecordText_);
