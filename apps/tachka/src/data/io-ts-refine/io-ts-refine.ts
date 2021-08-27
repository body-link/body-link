import { refine } from '../utils';
import { t, tt } from '../../common/modules';

export const NonEmptyString: t.StringC = refine(t.string, tt.NonEmptyString.is, 'NonEmptyString');

const REGEX_SLUG: RegExp = new RegExp('^[a-z0-9]+(?:-[a-z0-9]+)*$');
export const Slug: t.StringC = refine(t.string, (s) => REGEX_SLUG.test(s), 'Slug');

export const Integer: t.NumberC = refine(t.number, Number.isInteger, 'Integer');

const MAX_MILLISECONDS_TIMESTAMP: number = 2147483647 * 1000;
export const MillisecondsTimestamp: t.NumberC = refine(
  Integer,
  (n) => n > 0 && n < MAX_MILLISECONDS_TIMESTAMP,
  'MillisecondsTimestamp'
);

const MAX_MINUTES_OFFSET: number = 1440;
export const MinutesOffset: t.NumberC = refine(
  Integer,
  (n) => n >= -MAX_MINUTES_OFFSET && n <= MAX_MINUTES_OFFSET,
  'MinutesOffset'
);
