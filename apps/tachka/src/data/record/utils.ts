/* eslint-disable @typescript-eslint/naming-convention */
import * as t from 'io-ts';
import { tr } from '../io-ts-refine';
import { M, option, Program, refine, summon } from '../utils';

export interface IRecordBase {
  id: string;
  source: string;
  group: string;
  owner: string;
  timestamp: number;
  offset: number | undefined;
  duration: number;
}

const RecordBaseC: t.Type<IRecordBase, IRecordBase> = t.type({
  id: tr.NonEmptyString,
  source: tr.Slug,
  group: tr.Slug,
  owner: tr.Slug,
  timestamp: tr.MillisecondsTimestamp,
  offset: option(tr.MinutesOffset),
  duration: refine(tr.Integer, (n) => n >= 0, 'Duration'),
});

const RecordBase: M<IRecordBase, IRecordBase> = summon((F) =>
  F.interface(
    {
      id: F.string(),
      source: F.string(),
      group: F.string(),
      owner: F.string(),
      timestamp: F.number(),
      offset: F.optional(F.number()),
      duration: F.number(),
    },
    'RecordBase',
    {
      IoTsURI: () => RecordBaseC,
    }
  )
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createRecordFromData = <E, A, N extends string>(data: Program<E, A>, name: N) =>
  summon((F) =>
    F.intersection(
      RecordBase(F),
      F.interface(
        {
          type: F.tag(name),
          data: data(F),
        },
        name
      )
    )(name)
  );
